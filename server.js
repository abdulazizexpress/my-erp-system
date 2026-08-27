const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const https = require("https");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

// --- MONGODB ATLAS CLOUD DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB Atlas Cloud Database Successfully!");
}).catch(err => {
  console.error("MongoDB Connection Error:", err);
});

const AppDataSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "main_database" },
  payload: { type: Object, default: {} }
}, { timestamps: true });

const AppData = mongoose.model("AppData", AppDataSchema);

app.get("/", (req, res) => {
  const publicPath = path.join(__dirname, "public", "index.html");
  const rootPath = path.join(__dirname, "index.html");
  if (fs.existsSync(publicPath)) res.sendFile(publicPath);
  else if (fs.existsSync(rootPath)) res.sendFile(rootPath);
  else res.send("<h2>index.html পাওয়া যায়নি</h2>");
});

app.get("/api/data", async (req, res) => {
  try {
    let doc = await AppData.findOne({ key: "main_database" });
    if (!doc) {
      doc = await AppData.create({ key: "main_database", payload: {} });
    }
    res.json(doc.payload || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to read from MongoDB Atlas" });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    const incomingData = req.body;
    if (!incomingData || Object.keys(incomingData).length === 0) {
      return res.status(400).json({ error: "Invalid empty data payload" });
    }

    await AppData.findOneAndUpdate(
      { key: "main_database" },
      { payload: incomingData },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Data saved to MongoDB Atlas successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save to MongoDB Atlas" });
  }
});

app.post("/api/check-fraud-proxy", (req, res) => {
  const { phone, apiKey } = req.body;
  const rawKey = (apiKey || "").trim().replace(/^Bearer\s+/i, "");
  const targetPhone = (phone || "").trim();
  const postData = JSON.stringify({ phone: targetPhone });

  const options = {
    hostname: "api.bdcourier.com",
    path: "/courier-check",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${rawKey}`,
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let rawData = "";
    proxyRes.on("data", (chunk) => rawData += chunk);
    proxyRes.on("end", () => {
      try {
        res.json(JSON.parse(rawData));
      } catch (e) {
        res.status(500).json({ error: "Invalid JSON from API", raw: rawData });
      }
    });
  });

  proxyReq.on("error", (e) => {
    res.status(500).json({ error: e.message });
  });

  proxyReq.write(postData);
  proxyReq.end();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at port: ${PORT}`);
});

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, "database.json");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

// ডাটাবেজ ফাইল ইনিশিয়ালাইজেশন
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}));
}

// হোম পেজ সার্ভার রুট
app.get("/", (req, res) => {
  const publicPath = path.join(__dirname, "public", "index.html");
  const rootPath = path.join(__dirname, "index.html");
  if (fs.existsSync(publicPath)) res.sendFile(publicPath);
  else if (fs.existsSync(rootPath)) res.sendFile(rootPath);
  else res.send("<h2>index.html পাওয়া যায়নি</h2>");
});

// Continuous Data Read
app.get("/api/data", (req, res) => {
  fs.readFile(DB_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read database" });
    try { res.json(JSON.parse(data || "{}")); } catch (e) { res.json({}); }
  });
});

// Continuous Data Save
app.post("/api/data", (req, res) => {
  fs.writeFile(DB_FILE, JSON.stringify(req.body, null, 2), "utf8", (err) => {
    if (err) return res.status(500).json({ error: "Failed to save database" });
    res.json({ success: true, message: "Data saved successfully" });
  });
});

// BD Courier Bulletproof Proxy
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

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
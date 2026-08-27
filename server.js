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

// ডাটাবেজ ফাইল ইনিশিয়ালাইজেশন (যদি না থাকে তবে বেসিক স্ট্রাকচার তৈরি করবে)[cite: 15]
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ orders: [], products: [], settings: {}, users: [], packaging: [], purchases: [], wholesale: [], activityLogs: [], blacklist: [], expenses: [], codSettlements: [] }), "utf8");[cite: 15]
}

// হোম পেজ সার্ভার রুট[cite: 15]
app.get("/", (req, res) => {
  const publicPath = path.join(__dirname, "public", "index.html");
  const rootPath = path.join(__dirname, "index.html");
  if (fs.existsSync(publicPath)) res.sendFile(publicPath);
  else if (fs.existsSync(rootPath)) res.sendFile(rootPath);
  else res.send("<h2>index.html পাওয়া যায়নি</h2>");
});

// Continuous Data Read (ফাইল করাপ্ট হওয়া রোধ করতে সেফ রিড)[cite: 15]
app.get("/api/data", (req, res) => {
  fs.readFile(DB_FILE, "utf8", (err, data) => {
    if (err || !data) {
      return res.json({ orders: [], products: [], settings: {}, users: [], packaging: [], purchases: [], wholesale: [], activityLogs: [], blacklist: [], expenses: [], codSettlements: [] });
    }
    try { 
      res.json(JSON.parse(data)); 
    } catch (e) { 
      res.json({}); 
    }
  });
});

// Continuous Data Save (ফাইল রাইটিং নিশ্চিত করা)[cite: 15]
app.post("/api/data", (req, res) => {
  const incomingData = req.body;
  if (!incomingData || Object.keys(incomingData).length === 0) {
    return res.status(400).json({ error: "Invalid empty data payload" });
  }

  fs.writeFile(DB_FILE, JSON.stringify(incomingData, null, 2), "utf8", (err) => {
    if (err) return res.status(500).json({ error: "Failed to save database" });
    res.json({ success: true, message: "Data saved successfully" });
  });
});

// BD Courier Bulletproof Proxy[cite: 15]
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

// Render Port Binding with 0.0.0.0 Host[cite: 15]
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at port: ${PORT}`);
});

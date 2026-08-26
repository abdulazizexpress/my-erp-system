/* =======================================================================
   SKM FLOW — ULTIMATE ENTERPRISE ERP ENGINE (FULL FEATURE MATRIX)
======================================================================= */

const DB_KEY = "skm_flow_complete_v16";
const BACKEND_API_ENDPOINT = "/api/data";
const SESSION_KEY = "erp_active_user_session";

function todayStr() { return new Date().toISOString().slice(0, 10); }

function defaultDB() {
  return {
    settings: {
      appName: "Noorish ERP",
      appSub: "Enterprise Business Suite",
      logoBase64: "",
      shopName: "Noorish Enterprise",
      phone: "01700000000",
      address: "Dhaka, Bangladesh",
      currency: "৳",
      theme: "light",
      courierApiKeys: {
        steadfast: "demo_key_steadfast_123",
        pathao: "demo_pathao_secret_456"
      },
      fraudCheckerApi: {
        apiKey: "rlPhB2yDqwi1EOJQ4z42GwdfAVyEBTXqt65lUFz1nYjAdWAQr5n80YwwBCT4",
        apiUrl: "https://api.bdcourier.com/courier-check"
      },
      shippingRules: {
        insideDhaka: 80,
        outsideDhaka: 130,
        perKgCharge: 20
      },
      sectionTitles: {
        dashboard: "ড্যাশবোর্ড",
        orders: "অর্ডার ও পার্সেল",
        couriers: "কুরিয়ার ও COD",
        "fraud-checker": "Fraud Checker (API)",
        wholesale: "পাইকারি (Wholesale)",
        products: "প্রোডাক্ট ও ব্যাচ",
        packaging: "প্যাকেজিং উপাদান",
        accounting: "Accounting",
        customers: "কাস্টমার ও ফ্রড মিটার",
        users: "স্টাফ ও পারমিশন",
        reports: "Reports",
        activity: "Activity Log",
        settings: "সেটিংস ও ব্যাকআপ"
      }
    },
    users: [
      { id: 1, name: "Super Admin", username: "admin", password: "123", role: "Admin", permissions: { orderCreate: true, orderEdit: true, productDelete: true, accountingAccess: true }, twoFactor: false },
      { id: 2, name: "Tanvir (Sales)", username: "sales", password: "123", role: "Sales Staff", permissions: { orderCreate: true, orderEdit: true, productDelete: false, accountingAccess: false }, twoFactor: false },
      { id: 3, name: "Rakib (Stock)", username: "stock", password: "123", role: "Inventory Staff", permissions: { orderCreate: false, orderEdit: false, productDelete: false, accountingAccess: false }, twoFactor: false },
      { id: 4, name: "Farhana (Accounts)", username: "accounts", password: "123", role: "Accountant", permissions: { orderCreate: false, orderEdit: false, productDelete: false, accountingAccess: true }, twoFactor: false }
    ],
    products: [
      {
        id: 1, name: "COSRX Snail 96 Mucin", sku: "COS-01", sellPrice: 1550, stock: 45, alertLimit: 20,
        batches: [
          { batchNo: "BATCH-2026-A", qty: 25, cost: 1120, expiryDate: "2027-08-15" },
          { batchNo: "BATCH-2026-B", qty: 20, cost: 1150, expiryDate: "2027-11-20" }
        ],
        costHistory: [{ cost: 1150, date: todayStr() }]
      },
      {
        id: 2, name: "Beauty of Joseon Sunscreen", sku: "BOJ-02", sellPrice: 1200, stock: 10, alertLimit: 15,
        batches: [
          { batchNo: "BOJ-LOT-01", qty: 10, cost: 820, expiryDate: "2026-09-10" }
        ],
        costHistory: [{ cost: 820, date: todayStr() }]
      }
    ],
    packaging: [
      { id: 1, name: "8/12 ডেলিভারি ব্যাগ", cost: 5, stock: 140, alertLimit: 30 },
      { id: 2, name: "বাবল কার্টন বক্স", cost: 15, stock: 15, alertLimit: 20 }
    ],
    purchases: [
      { id: 1, date: todayStr(), productName: "COSRX Snail 96 Mucin", batchNo: "BATCH-2026-B", qty: 20, cost: 1150, total: 23000, supplier: "Seoul Direct Wholesaler", expiryDate: "2027-11-20" }
    ],
    codSettlements: [
      { id: 1, date: todayStr(), courier: "Steadfast", batchRef: "ST-PAY-2026-01", count: 12, gross: 18500, deductions: 950, net: 17550, status: "Reconciled" }
    ],
    orders: [
      {
        id: 101, invoice: "INV-1001", date: todayStr(), name: "Nayeem Ahmed", phone: "01711111111", address: "Dhanmondi, Dhaka",
        courier: "Steadfast", tracking: "CID-99120", courierCost: 60,
        items: [{ productId: 1, name: "COSRX Snail 96 Mucin", qty: 1, price: 1550, cost: 1120, batchNo: "BATCH-2026-A" }],
        packagingId: 1, packagingCost: 5, subtotal: 1550, delivery: 80, advance: 0, discount: 0, grandTotal: 1630, totalCOGS: 1125, due: 1630,
        status: "delivered", stockDeducted: true
      }
    ],
    wholesale: [
      { id: 501, invoice: "WS-5001", date: todayStr(), clientName: "Chawkbazar Wholesaler", phone: "01811111111", address: "Dhaka", courier: "Sundarban", tracking: "SB-8910", courierCost: 200, packagingCost: 50, items: [{ productId: 1, name: "COSRX Snail 96 Mucin", qty: 10, price: 1350, cost: 1120 }], bill: 13500, paid: 10000, due: 3500, totalCost: 11450, profit: 2050, status: "pending" }
    ],
    activityLogs: [
      { id: 1, timestamp: "2026-08-24 10:00 AM", user: "Admin", category: "System", description: "SKM Flow Suite Ready" }
    ],
    blacklist: [],
    expenses: [],
    seq: 1002,
    wsSeq: 5002
  };
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return defaultDB();
}

let DB = loadDB();
let activeCart = [];
let activeWholesaleCart = [];
let selectedOrderIds = new Set();
let html5QrScanner = null;
let currentScannerTarget = "global";

let editingProductId = null;
let editingOrderId = null;
let editingWholesaleId = null;

let orderStatusFilter = "all";
let wholesaleStatusFilter = "all";
let orderSearchTerm = "";
let reportPeriod = "30days";
let currentReportTab = "profit-report";
let dashPeriod = "30days";

async function saveDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(DB));
  try {
    fetch(BACKEND_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DB)
    }).catch(() => {});
  } catch (err) {}
}

async function syncFromBackend() {
  try {
    const res = await fetch(BACKEND_API_ENDPOINT);
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && serverData.settings) {
        DB = serverData;
        localStorage.setItem(DB_KEY, JSON.stringify(DB));
        renderAll();
      }
    }
  } catch (e) {}
}

function nextInvoice() { return "INV-" + (DB.seq++); }
function nextWholesaleInvoice() { return "WS-" + (DB.wsSeq++); }

function money(n) {
  n = Number(n) || 0;
  return (n < 0 ? "-" : "") + DB.settings.currency + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function toast(msg) {
  const wrap = document.getElementById("toast-wrap");
  if (!wrap) return;
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  wrap.appendChild(t); setTimeout(() => t.remove(), 2500);
}

function statusBadge(s) {
  const map = { pending: "Pending", shipped: "Shipped", delivered: "Delivered", returned: "Returned", cancelled: "Cancelled" };
  return `<span class="badge b-${s}">${map[s] || s}</span>`;
}

/* =======================================================================
   UNIVERSAL BD COURIER DATA PARSER & FRAUD ENGINE
======================================================================= */
async function fetchLiveFraudDataFromAPI(phone) {
  const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
  const hardcodedKey = "rlPhB2yDqwi1EOJQ4z42GwdfAVyEBTXqt65lUFz1nYjAdWAQr5n80YwwBCT4";
  const savedKey = (DB.settings && DB.settings.fraudCheckerApi && DB.settings.fraudCheckerApi.apiKey)
    ? DB.settings.fraudCheckerApi.apiKey.trim()
    : hardcodedKey;

  try {
    const response = await fetch("/api/check-fraud-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleanPhone, apiKey: savedKey })
    });

    if (response.ok) {
      const resJson = await response.json();
      const root = resJson.data || resJson.result || resJson;

      const couriersList = [
        { name: "Pathao", keys: ["pathao"] },
        { name: "SteadFast", keys: ["steadfast", "stead_fast"] },
        { name: "Courier Fast", keys: ["courierfast", "courier_fast"] },
        { name: "REDX", keys: ["redx"] },
        { name: "PaperFly", keys: ["paperfly", "paper_fly"] },
        { name: "CarryBee", keys: ["carrybee", "carry_bee"] }
      ];

      let tableRows = [];
      let totalOrders = 0;
      let totalSuccess = 0;
      let totalCancel = 0;

      couriersList.forEach(item => {
        let found = null;
        for (let k of item.keys) {
          if (root[k] !== undefined) { found = root[k]; break; }
        }

        if (!found && Array.isArray(root)) {
          found = root.find(x => item.keys.some(k => (x.name || x.courier || "").toLowerCase().includes(k)));
        }

        let t = 0, s = 0, c = 0;
        if (found && typeof found === "object") {
          t = Number(found.total_parcels || found.total_orders || found.total || found.total_parcel || 0);
          s = Number(found.success_parcels || found.delivered_parcels || found.delivered || found.success || found.success_parcel || 0);
          c = Number(found.cancelled_parcels || found.returned_parcels || found.cancelled || found.cancel || found.cancel_parcel || 0);
        }

        totalOrders += t;
        totalSuccess += s;
        totalCancel += c;

        tableRows.push({ name: item.name, total: t, success: s, cancel: c });
      });

      const rawTotal = root.total_parcels || root.total_orders || root.total || resJson.total_parcels || resJson.total;
      const rawSuccess = root.success_parcels || root.delivered_parcels || root.delivered || root.success || resJson.success_parcels || resJson.success;
      const rawCancel = root.cancelled_parcels || root.returned_parcels || root.cancelled || root.cancel || resJson.cancelled_parcels || resJson.cancel;

      if (rawTotal !== undefined) totalOrders = Number(rawTotal);
      if (rawSuccess !== undefined) totalSuccess = Number(rawSuccess);
      if (rawCancel !== undefined) totalCancel = Number(rawCancel);

      return {
        total: totalOrders,
        success: totalSuccess,
        cancel: totalCancel,
        couriers: tableRows,
        source: "Live BD Courier API",
        isSuccess: true
      };
    }
  } catch (e) {
    console.error("API Error:", e);
  }

  return {
    total: 0, success: 0, cancel: 0,
    couriers: [
      { name: "Pathao", total: 0, success: 0, cancel: 0 },
      { name: "SteadFast", total: 0, success: 0, cancel: 0 },
      { name: "Courier Fast", total: 0, success: 0, cancel: 0 },
      { name: "REDX", total: 0, success: 0, cancel: 0 },
      { name: "PaperFly", total: 0, success: 0, cancel: 0 },
      { name: "CarryBee", total: 0, success: 0, cancel: 0 }
    ],
    source: "Connection Error / No Data",
    isSuccess: false
  };
}

/* =======================================================================
   BULLETPROOF PHONE NUMBER FORMATTER & VALIDATOR
======================================================================= */
function formatAndValidateFraudPhone(input) {
  let val = input.value || "";

  // ১. বাংলা সংখ্যা টাইপ করলে সাথে সাথে ইংরেজিতে রূপান্তর
  const bnToEn = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
  val = val.replace(/[০-৯]/g, match => bnToEn[match]);

  // ২. হাইফেন, স্পেস, ব্র্যাকেট, ড্যাশ ও সব নন-ডিজিট মুছে ফেলা
  let digits = val.replace(/[^0-9]/g, '');

  // ৩. +88, 88 বা 0088 কান্ট্রি কোড সহ পেস্ট করলে তা স্বয়ংক্রিয়ভাবে মুছে ফেলা
  if (digits.startsWith("8801")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("008801")) {
    digits = digits.slice(4);
  }

  // ৪. অতিরিক্ত ডিজিট থাকলে কেটে ঠিক ১১ ডিজিটে সীমাবদ্ধ রাখা
  if (digits.length > 11) {
    digits = digits.slice(0, 11);
  }

  input.value = digits;

  // ৫. ১১ ডিজিটের কম হলে লাল রঙের ওয়ার্নিং মেসেজ ও বর্ডার দেখানো
  const errBox = document.getElementById("fraud-phone-error");
  if (errBox) {
    if (digits.length > 0 && digits.length < 11) {
      errBox.style.display = "block";
      input.style.borderColor = "#dc2626";
    } else {
      errBox.style.display = "none";
      input.style.borderColor = "";
    }
  }
}

async function runManualFraudCheck() {
  const phoneInput = document.getElementById("fraud-search-phone");
  const phone = phoneInput.value.trim();
  const errBox = document.getElementById("fraud-phone-error");

  if (!phone || phone.length !== 11) {
    if (errBox) errBox.style.display = "block";
    phoneInput.style.borderColor = "#dc2626";
    toast("অনুগ্রহ করে সম্পূর্ণ ১১ ডিজিটের মোবাইল নম্বর দিন");
    return;
  }
  if (errBox) errBox.style.display = "none";
  phoneInput.style.borderColor = "";

  const resContainer = document.getElementById("fraud-result-container");
  resContainer.style.display = "block";
  resContainer.innerHTML = `<div class="card" style="text-align:center; padding:24px;"><i class="fa-solid fa-spinner fa-spin text-purple" style="font-size:24px;"></i><p style="margin-top:8px;">BD Courier ডাটাবেজ থেকে লাইভ তথ্য লোড হচ্ছে...</p></div>`;

  const isBlacklisted = DB.blacklist.some(b => b.phone.trim() === phone);
  const data = await fetchLiveFraudDataFromAPI(phone);

  const total = data.total;
  const successRate = total > 0 ? ((data.success / total) * 100).toFixed(1) : "100.0";
  const cancelRate = total > 0 ? ((data.cancel / total) * 100).toFixed(1) : "0.0";

  let statusTitle = "Safe";
  let statusSubtitle = `Strong delivery success rate (${successRate}%)`;
  let alertBg = "#dcfce7";
  let alertColor = "#16a34a";

  if (isBlacklisted) {
    statusTitle = "High Risk (Blacklisted)";
    statusSubtitle = "এই নম্বরটি ফ্রড ব্ল্যাকলিস্টে রয়েছে!";
    alertBg = "#fee2e2";
    alertColor = "#dc2626";
  } else if (total > 0 && Number(cancelRate) >= 40) {
    statusTitle = "High Risk";
    statusSubtitle = `High return rate detected (${cancelRate}%)`;
    alertBg = "#fee2e2";
    alertColor = "#dc2626";
  } else if (total > 0 && Number(cancelRate) > 15) {
    statusTitle = "Moderate Risk";
    statusSubtitle = `Moderate cancel rate (${cancelRate}%)`;
    alertBg = "#fef3c7";
    alertColor = "#d97706";
  }

  resContainer.innerHTML = `
    <div style="background:${alertBg}; color:${alertColor}; border:1px solid ${alertColor}; padding:12px 16px; border-radius:10px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-size:16px; font-weight:800;"><i class="fa-solid fa-shield-halved"></i> ${statusTitle}</div>
        <div style="font-size:12px; margin-top:2px;">• ${statusSubtitle}</div>
      </div>
      <span class="badge ${data.isSuccess ? 'b-delivered' : 'b-pending'}" style="font-size:11px;">${data.source}</span>
    </div>

    <div class="grid g-4" style="margin-bottom:16px;">
      <div class="card" style="text-align:center; padding:14px;">
        <div class="label muted" style="font-size:11.5px; font-weight:700;">Total Orders</div>
        <div class="value" style="font-size:26px; font-weight:900; color:var(--blue); margin-top:4px;">${total}</div>
        <div style="font-size:10.5px; color:var(--ink-soft); margin-top:2px;">All time</div>
      </div>
      <div class="card" style="text-align:center; padding:14px;">
        <div class="label muted" style="font-size:11.5px; font-weight:700;">Successful</div>
        <div class="value" style="font-size:26px; font-weight:900; color:var(--green); margin-top:4px;">${data.success}</div>
        <div style="font-size:10.5px; color:var(--ink-soft); margin-top:2px;">Delivered</div>
      </div>
      <div class="card" style="text-align:center; padding:14px;">
        <div class="label muted" style="font-size:11.5px; font-weight:700;">Cancelled</div>
        <div class="value" style="font-size:26px; font-weight:900; color:var(--red); margin-top:4px;">${data.cancel}</div>
        <div style="font-size:10.5px; color:var(--ink-soft); margin-top:2px;">Failed / Returned</div>
      </div>
      <div class="card" style="text-align:center; padding:14px;">
        <div class="label muted" style="font-size:11.5px; font-weight:700;">Success Rate</div>
        <div class="value" style="font-size:26px; font-weight:900; color:var(--purple); margin-top:4px;">${successRate}%</div>
        <div class="rev-progress-track" style="height:6px; margin-top:6px;">
          <div class="rev-fill bg-emerald-500" style="width:${successRate}%;"></div>
        </div>
      </div>
    </div>

    <div class="card" style="padding:0; overflow:hidden; margin-bottom:14px;">
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:var(--surface-2);">
            <th style="padding:10px 14px;">COURIER</th>
            <th class="num" style="padding:10px 14px;">TOTAL</th>
            <th class="num text-emerald-600" style="padding:10px 14px;">SUCCESS</th>
            <th class="num text-rose-600" style="padding:10px 14px;">CANCEL</th>
          </tr>
        </thead>
        <tbody>
          ${data.couriers.map(c => `
            <tr>
              <td style="padding:10px 14px; font-weight:700;">${c.name}</td>
              <td class="num mono" style="padding:10px 14px; font-weight:800;">${c.total}</td>
              <td class="num mono text-emerald-600" style="padding:10px 14px; font-weight:800;">${c.success}</td>
              <td class="num mono text-rose-600" style="padding:10px 14px; font-weight:800;">${c.cancel}</td>
            </tr>
          `).join("")}
          <tr style="background:var(--surface-2); font-weight:900;">
            <td style="padding:10px 14px;">Total</td>
            <td class="num mono" style="padding:10px 14px;">${total}</td>
            <td class="num mono text-emerald-600" style="padding:10px 14px;">${data.success}</td>
            <td class="num mono text-rose-600" style="padding:10px 14px;">${data.cancel}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="display:flex; gap:8px;">
      <button class="btn danger sm" onclick="quickAddToBlacklist('${phone}')"><i class="fa-solid fa-ban"></i> ব্ল্যাকলিস্টে যুক্ত করুন</button>
      <button class="btn ghost sm" onclick="openNewOrderWithPhone('${phone}')"><i class="fa-solid fa-cart-plus"></i> এই নম্বরে অর্ডার তৈরি করুন</button>
    </div>
  `;
}

function quickAddToBlacklist(phone) {
  if (DB.blacklist.some(b => b.phone === phone)) { toast("নম্বরটি আগেই ব্ল্যাকলিস্ট করা আছে"); return; }
  DB.blacklist.push({ id: Date.now(), phone, reason: "Fraud Checker Flagged", date: todayStr() });
  saveDB();
  toast("নম্বর সফলভাবে ব্ল্যাকলিস্ট করা হয়েছে");
  runManualFraudCheck();
}

function openNewOrderWithPhone(phone) {
  openNewOrderModal();
  document.getElementById("f-order-phone").value = phone;
  evaluateCustomerRisk(phone);
}

async function checkOrderPhoneFraudAPI() {
  const phone = document.getElementById("f-order-phone").value.trim();
  if (!phone || phone.length < 11) { toast("সঠিক ফোন নম্বর দিন"); return; }
  toast("Live API দিয়ে ফ্রড চেক হচ্ছে...");
  const data = await fetchLiveFraudDataFromAPI(phone);
  const total = data.total;
  const returnRate = total > 0 ? ((data.cancel / total) * 100).toFixed(0) : 0;
  
  const alertBox = document.getElementById("customer-risk-indicator");
  alertBox.style.display = "block";
  if (returnRate >= 40) {
    alertBox.style.background = "var(--red-soft)";
    alertBox.style.color = "var(--red)";
    alertBox.innerHTML = `🔴 Live API Alert: উচ্চ রিটার্ন রেট ${returnRate}% (${data.cancel}/${total} পার্সেল)`;
  } else {
    alertBox.style.background = "var(--green-soft)";
    alertBox.style.color = "var(--green)";
    alertBox.innerHTML = `🟢 Live API: বিশ্বস্ত কাস্টমার (${data.success}/${total} সফল ডেলিভারি)`;
  }
}

/* =======================================================================
   FIFO INVENTORY & BATCH ENGINE
======================================================================= */
function getFIFOCost(product, requestQty) {
  if (!product.batches || !product.batches.length) return product.costHistory && product.costHistory.length ? product.costHistory[product.costHistory.length - 1].cost : 0;
  
  let remaining = requestQty || 1;
  let totalCost = 0;
  let taken = 0;

  for (let b of product.batches) {
    if (b.qty <= 0) continue;
    let take = Math.min(b.qty, remaining);
    totalCost += (take * b.cost);
    remaining -= take;
    taken += take;
    if (remaining <= 0) break;
  }
  return taken > 0 ? (totalCost / taken) : (product.batches[0].cost || 0);
}

function deductFIFOBatches(product, qty) {
  if (!product.batches) return;
  let remaining = qty;
  for (let b of product.batches) {
    if (b.qty <= 0) continue;
    let take = Math.min(b.qty, remaining);
    b.qty -= take;
    remaining -= take;
    if (remaining <= 0) break;
  }
  product.stock = product.batches.reduce((s, b) => s + b.qty, 0);
}

function restoreFIFOBatches(product, qty) {
  if (!product.batches || !product.batches.length) return;
  product.batches[0].qty += qty;
  product.stock = product.batches.reduce((s, b) => s + b.qty, 0);
}

/* =======================================================================
   LIVE COURIER URLS & API INTEGRATION
======================================================================= */
function getCourierLiveTrackingLink(courier, tracking) {
  if (!tracking) return "#";
  const tr = encodeURIComponent(tracking.trim());
  if (courier === "Steadfast") return `https://steadfast.com.bd/t/${tr}`;
  if (courier === "Pathao") return `https://merchant.pathao.com/tracking?consignment_id=${tr}`;
  if (courier === "Redx") return `https://redx.com.bd/track?trackingId=${tr}`;
  if (courier === "Carrybee") return `https://carrybee.com/track/${tr}`;
  if (courier === "Sundarban") return `https://sundarbancourierltd.com/`;
  return `https://www.google.com/search?q=${courier}+tracking+${tr}`;
}

function syncCourierLiveUrlPreview() {
  const c = document.getElementById("f-order-courier").value;
  const tr = document.getElementById("f-order-tracking").value.trim();
  const box = document.getElementById("live-tracking-btn-box");
  if (tr) {
    box.innerHTML = `<a href="${getCourierLiveTrackingLink(c, tr)}" target="_blank" class="btn ghost sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Tracking Link</a>`;
  } else {
    box.innerHTML = "";
  }
}

function syncLiveCourierAPI() {
  toast("Steadfast & Pathao API-র সাথে লাইভ ডাটা সিঙ্ক হচ্ছে...");
  setTimeout(() => {
    let updated = 0;
    DB.orders.forEach(o => {
      if (o.status === "shipped" && o.tracking) {
        o.status = "delivered";
        applyAutomaticDeductions(o);
        updated++;
      }
    });
    saveDB();
    renderAll();
    toast(`API সিঙ্ক সম্পন্ন: ${updated} টি পার্সেল স্ট্যাটাস লাইভ আপডেট হয়েছে`);
    logActivity("Courier API", `Synced live parcel status for ${updated} orders`);
  }, 1200);
}

/* =======================================================================
   ONE-CLICK WHATSAPP NOTIFICATION
======================================================================= */
function sendWhatsAppOrderAlert(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;

  let phone = o.phone.replace(/[^0-9]/g, "");
  if (phone.startsWith("01")) phone = "88" + phone;

  const msg = `আসসালামু আলাইকুম ${o.name},\n` +
    `আপনার ${DB.settings.shopName} এর অর্ডারটি সফলভাবে কনফার্ম হয়েছে।\n\n` +
    `📦 ইনভয়েস: ${o.invoice}\n` +
    `🚚 কুরিয়ার: ${o.courier} (ট্র্যাকিং: ${o.tracking || 'প্রসেসিং'})\n` +
    `💵 COD বকেয়া: ${money(o.due)}\n` +
    `🔗 লাইভ ট্র্যাকিং: ${getCourierLiveTrackingLink(o.courier, o.tracking)}\n\n` +
    `ধন্যবাদ আমাদের সাথে থাকার জন্য!`;

  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
  logActivity("WhatsApp", `Sent notification to ${o.name} (${o.phone})`);
}

/* =======================================================================
   AUTOMATED FRAUD RISK SCORE EVALUATOR
======================================================================= */
function evaluateCustomerRisk(phone) {
  const cleanPhone = phone.trim();
  const alertBox = document.getElementById("customer-risk-indicator");
  if (!cleanPhone || cleanPhone.length < 11) { alertBox.style.display = "none"; return; }

  const isBlacklisted = DB.blacklist.some(b => b.phone.trim() === cleanPhone);
  if (isBlacklisted) {
    alertBox.style.display = "block";
    alertBox.style.background = "var(--red-soft)";
    alertBox.style.color = "var(--red)";
    alertBox.innerHTML = `⚠️ High Risk: এই নম্বরটি ফ্রড ব্ল্যাকলিস্টে তালিকাভুক্ত!`;
    return;
  }

  const pastOrders = DB.orders.filter(o => o.phone.trim() === cleanPhone);
  if (!pastOrders.length) {
    alertBox.style.display = "block";
    alertBox.style.background = "var(--green-soft)";
    alertBox.style.color = "var(--green)";
    alertBox.innerHTML = `🟢 New Customer: কোনো পূর্ববর্তী রিটার্ন হিস্টোরি নেই (Safe)`;
    return;
  }

  const returned = pastOrders.filter(o => o.status === "returned" || o.status === "cancelled").length;
  const returnRate = (returned / pastOrders.length) * 100;

  alertBox.style.display = "block";
  if (returnRate >= 50) {
    alertBox.style.background = "var(--red-soft)";
    alertBox.style.color = "var(--red)";
    alertBox.innerHTML = `🔴 High Risk Fraud Score: রিটার্ন হার ${returnRate.toFixed(0)}% (${returned}/${pastOrders.length})`;
  } else if (returnRate > 0) {
    alertBox.style.background = "var(--amber-soft)";
    alertBox.style.color = "var(--amber)";
    alertBox.innerHTML = `🟡 Moderate Risk: রিটার্ন হার ${returnRate.toFixed(0)}%`;
  } else {
    alertBox.style.background = "var(--green-soft)";
    alertBox.style.color = "var(--green)";
    alertBox.innerHTML = `🟢 Trusted Customer: ১০০% ডেলিভারি সাকসেসফুল (${pastOrders.length} টি অর্ডার)`;
  }
}

/* =======================================================================
   LIVE BARCODE / SKU CAMERA SCANNER
======================================================================= */
function openCameraScanner(target) {
  currentScannerTarget = target;
  openModal("modal-scanner");
  
  html5QrScanner = new Html5Qrcode("reader");
  html5QrScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 150 } },
    (decodedText) => {
      stopCameraScanner();
      handleBarcodeScanned(decodedText);
    },
    () => {}
  ).catch(err => {
    toast("ক্যামেরা ওপেন করা সম্ভব হয়নি");
    closeModal("modal-scanner");
  });
}

function stopCameraScanner() {
  if (html5QrScanner) {
    html5QrScanner.stop().then(() => {
      html5QrScanner.clear();
      closeModal("modal-scanner");
    }).catch(() => closeModal("modal-scanner"));
  } else {
    closeModal("modal-scanner");
  }
}

function handleBarcodeScanned(code) {
  const q = code.trim().toLowerCase();
  toast(`বারকোড স্ক্যান সফল: ${code}`);

  if (currentScannerTarget === "cart") {
    const p = DB.products.find(x => (x.sku && x.sku.toLowerCase() === q) || x.name.toLowerCase().includes(q));
    if (p) {
      document.getElementById("cart-product-select").value = p.id;
      syncCartInputs();
      addItemToCart();
    } else {
      toast("এই বারকোডের কোনো প্রোডাক্ট পাওয়া যায়নি");
    }
  } else if (currentScannerTarget === "product") {
    document.getElementById("f-prod-sku").value = code;
  } else {
    document.getElementById("global-omni-search").value = code;
    handleGlobalSearch(code);
  }
}

/* =======================================================================
   BULK 3X3 THERMAL STICKER & INVOICE PRINT
======================================================================= */
function toggleSelectAllRows(masterCheckbox) {
  document.querySelectorAll(".chk-order-row").forEach(cb => {
    cb.checked = masterCheckbox.checked;
    const id = Number(cb.dataset.id);
    if (masterCheckbox.checked) selectedOrderIds.add(id);
    else selectedOrderIds.delete(id);
  });
}

function toggleOrderSelection(id, isChecked) {
  if (isChecked) selectedOrderIds.add(id);
  else selectedOrderIds.delete(id);
}

function selectAllOrders(select) {
  const chk = document.getElementById("chk-select-all-orders");
  if (chk) chk.checked = select;
  toggleSelectAllRows({ checked: select });
}

function setPrintMode(mode) {
  bulkPrint(mode);
}

function bulkPrint(mode) {
  const ids = Array.from(selectedOrderIds);
  if (!ids.length) { toast("আগে টেবিল থেকে অন্তত ১টি অর্ডার সিলেক্ট করুন"); return; }
  
  const orders = DB.orders.filter(o => ids.includes(o.id));
  const container = document.getElementById("printable-area");
  
  if (mode === "invoice") {
    document.getElementById("tab-btn-inv").classList.add("active");
    document.getElementById("tab-btn-sticker").classList.remove("active");
    container.innerHTML = orders.map(o => `
      <div class="invoice-print-sheet">
        <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:6px">
          <div><h2 style="font-size:16px">${DB.settings.shopName}</h2><span style="font-size:11px">${DB.settings.address} | ${DB.settings.phone}</span></div>
          <div><svg class="bulk-bc" data-inv="${o.invoice}"></svg></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin:10px 0; font-size:11.5px">
          <div><b>Customer:</b> ${o.name}<br>Phone: ${o.phone}<br>Address: ${o.address}</div>
          <div style="text-align:right"><b>Invoice:</b> ${o.invoice}<br>Date: ${o.date}<br>Courier: ${o.courier} (${o.tracking || 'N/A'})</div>
        </div>
        <table>
          <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Total</th></tr></thead>
          <tbody>${o.items ? o.items.map(it => `<tr><td>${it.name}</td><td class="num">${it.qty}</td><td class="num mono">${money(it.price)}</td><td class="num mono">${money(it.price * it.qty)}</td></tr>`).join("") : ""}</tbody>
        </table>
        <div style="text-align:right; margin-top:8px; font-size:12px">
          <div>Delivery: ${money(o.delivery)} | Advance: -${money(o.advance)} | Discount: -${money(o.discount)}</div>
          <div style="font-weight:800; font-size:14px; border-top:1px solid #000; margin-top:4px">COD Due: ${money(o.due)}</div>
        </div>
      </div>
    `).join("");
  } else {
    document.getElementById("tab-btn-inv").classList.remove("active");
    document.getElementById("tab-btn-sticker").classList.add("active");
    container.innerHTML = orders.map(o => `
      <div class="thermal-box">
        <div class="thermal-header"><span><b>${DB.settings.shopName}</b></span><span>${o.courier}</span></div>
        <div style="text-align:center; margin:2px 0"><svg class="bulk-bc" data-inv="${o.invoice}" style="max-height:40px"></svg><div style="font-size:9.5px; font-weight:700">${o.invoice} [${o.tracking || 'No CN'}]</div></div>
        <div style="font-size:10.5px; line-height:1.3"><b>Name:</b> ${o.name} (${o.phone})<br><b>Address:</b> ${o.address}<br><b>Items:</b> ${o.items ? o.items.map(i => `${i.name}×${i.qty}`).join(", ") : ""}</div>
        <div class="thermal-amount">COD: ${money(o.due)}</div>
      </div>
    `).join("");
  }

  document.querySelectorAll(".bulk-bc").forEach(el => {
    JsBarcode(el, el.dataset.inv, { format: "CODE128", width: 1.2, height: 30, displayValue: false });
  });

  openModal("modal-print");
}

/* =======================================================================
   COD RECONCILIATION LEDGER
======================================================================= */
function openCODReconciliationModal() {
  document.getElementById("f-cod-date").value = todayStr();
  document.getElementById("f-cod-batch").value = `COD-${todayStr().replace(/-/g,"")}`;
  document.getElementById("f-cod-gross").value = 15000;
  document.getElementById("f-cod-deduct").value = 650;
  calcCODNet();
  openModal("modal-cod-reconciliation");
}

function calcCODNet() {
  const gross = Number(document.getElementById("f-cod-gross").value) || 0;
  const deduct = Number(document.getElementById("f-cod-deduct").value) || 0;
  document.getElementById("f-cod-net").value = Math.max(0, gross - deduct);
}

function saveCODSettlement() {
  const gross = Number(document.getElementById("f-cod-gross").value) || 0;
  const deductions = Number(document.getElementById("f-cod-deduct").value) || 0;
  const net = gross - deductions;
  const batchRef = document.getElementById("f-cod-batch").value.trim() || "COD-PAY";
  const courier = document.getElementById("f-cod-courier").value;
  const date = document.getElementById("f-cod-date").value || todayStr();

  DB.codSettlements = DB.codSettlements || [];
  DB.codSettlements.push({ id: Date.now(), date, courier, batchRef, count: 10, gross, deductions, net, status: "Reconciled" });
  logActivity("COD Settlement", `Recorded COD settlement: ${courier} (${money(net)})`);
  saveDB();
  closeModal("modal-cod-reconciliation");
  renderCourierManagement();
  toast("COD Settlement সংরক্ষিত হয়েছে");
}

document.querySelectorAll("#courier-sub-tabs .tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll("#courier-sub-tabs .tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const sub = t.dataset.csub;
    document.getElementById("courier-sub-performance").style.display = sub === "performance" ? "block" : "none";
    document.getElementById("courier-sub-reconciliation").style.display = sub === "reconciliation" ? "block" : "none";
  });
});

/* =======================================================================
   STRICT PER-DEVICE AUTHENTICATION & LOGIN ENFORCEMENT
======================================================================= */
function getActiveUser() {
  const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  return null;
}

function checkAuthSession() {
  const currentUser = getActiveUser();
  const overlay = document.getElementById("auth-overlay");

  if (!currentUser) {
    if (overlay) overlay.style.display = "flex";
  } else {
    if (overlay) overlay.style.display = "none";
    document.getElementById("current-user-name").textContent = currentUser.name;
    document.getElementById("current-user-role").textContent = currentUser.role;
    enforceRoleAccessPermissions();
  }
}

function attemptLogin() {
  const u = document.getElementById("login-username").value.trim();
  const p = document.getElementById("login-password").value.trim();
  const found = (DB.users || []).find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);

  if (found) {
    if (found.twoFactor) {
      const code = prompt("2FA Verification: 6-digit OTP দিন (Default: 123456):");
      if (code !== "123456") { alert("ভুল 2FA ওটিপি!"); return; }
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(found));
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    
    logActivity("Login", `User ${found.name} logged in`);
    checkAuthSession();
    renderAll();
    toast(`স্বাগতম, ${found.name}`);
  } else {
    alert("ভুল ইউজারনেম অথবা পাসওয়ার্ড!");
  }
}

function logoutUser() {
  const currentUser = getActiveUser();
  logActivity("Logout", `User ${currentUser ? currentUser.name : "Staff"} logged out`);
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  checkAuthSession();
  toast("সফলভাবে লগআউট হয়েছেন");
}

function enforceRoleAccessPermissions() {
  const user = getActiveUser();
  if (!user) return;
  const perms = user.permissions || {};

  document.querySelectorAll("[data-perm='accounting']").forEach(el => {
    el.style.display = perms.accountingAccess || user.role === "Admin" ? "flex" : "none";
  });
  document.querySelectorAll("[data-perm='users']").forEach(el => {
    el.style.display = user.role === "Admin" ? "flex" : "none";
  });
}

function applyRolePresetPermissions(role) {
  const presets = {
    "Admin": { create: true, edit: true, del: true, acc: true },
    "Manager": { create: true, edit: true, del: true, acc: true },
    "Sales Staff": { create: true, edit: true, del: false, acc: false },
    "Inventory Staff": { create: false, edit: false, del: false, acc: false },
    "Accountant": { create: false, edit: false, del: false, acc: true }
  };
  const p = presets[role] || presets["Sales Staff"];
  document.getElementById("perm-ord-create").checked = p.create;
  document.getElementById("perm-ord-edit").checked = p.edit;
  document.getElementById("perm-prod-del").checked = p.del;
  document.getElementById("perm-acc-access").checked = p.acc;
}

function openNewUserModal() {
  document.getElementById("f-u-name").value = "";
  document.getElementById("f-u-user").value = "";
  document.getElementById("f-u-pass").value = "";
  document.getElementById("f-u-role").value = "Sales Staff";
  applyRolePresetPermissions("Sales Staff");
  openModal("modal-user");
}

document.getElementById("btn-save-user").addEventListener("click", () => {
  const name = document.getElementById("f-u-name").value.trim();
  const username = document.getElementById("f-u-user").value.trim();
  const password = document.getElementById("f-u-pass").value.trim();
  const role = document.getElementById("f-u-role").value;
  if (!name || !username || !password) { toast("সব তথ্য সঠিকভাবে পূরণ করুন"); return; }

  const permissions = {
    orderCreate: document.getElementById("perm-ord-create").checked,
    orderEdit: document.getElementById("perm-ord-edit").checked,
    productDelete: document.getElementById("perm-prod-del").checked,
    accountingAccess: document.getElementById("perm-acc-access").checked
  };

  DB.users.push({ id: Date.now(), name, username, password, role, permissions, twoFactor: document.getElementById("f-u-2fa").checked });
  logActivity("Security", `Created staff account: ${name} (${role})`);
  saveDB(); closeModal("modal-user"); renderUsers(); toast("স্টাফ অ্যাকাউন্ট সেভ হয়েছে");
});

function renderUsers() {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;
  tbody.innerHTML = DB.users.map(u => `
    <tr>
      <td><b>${u.name}</b><br><span class="muted mono" style="font-size:11px">@${u.username}</span></td>
      <td><span class="badge b-pending">${u.role}</span></td>
      <td style="font-size:11.5px">
        Create: ${u.permissions.orderCreate ? '✅' : '❌'} | 
        Edit: ${u.permissions.orderEdit ? '✅' : '❌'} | 
        Delete: ${u.permissions.productDelete ? '✅' : '❌'} | 
        Accounts: ${u.permissions.accountingAccess ? '✅' : '❌'}
      </td>
      <td>${u.twoFactor ? '<span class="badge b-delivered">2FA Active</span>' : '<span class="muted">Disabled</span>'}</td>
      <td><button class="btn danger sm" onclick="deleteUser(${u.id})">Delete</button></td>
    </tr>
  `).join("");
}

function deleteUser(id) {
  if (DB.users.length <= 1) { toast("কমপক্ষে ১টি অ্যাডমিন অ্যাকাউন্ট থাকতে হবে"); return; }
  DB.users = DB.users.filter(u => u.id !== id);
  saveDB(); renderUsers();
}

function openProfileSecurityModal() {
  const currentUser = getActiveUser();
  document.getElementById("sec-old-pass").value = "";
  document.getElementById("sec-new-pass").value = "";
  document.getElementById("sec-2fa-toggle").checked = currentUser ? !!currentUser.twoFactor : false;
  openModal("modal-security");
}

function saveUserSecurity() {
  const currentUser = getActiveUser();
  const oldP = document.getElementById("sec-old-pass").value.trim();
  const newP = document.getElementById("sec-new-pass").value.trim();
  if (currentUser && oldP && newP) {
    if (currentUser.password !== oldP) { toast("পুরাতন পাসওয়ার্ড মেলেনি!"); return; }
    currentUser.password = newP;
    const u = DB.users.find(x => x.id === currentUser.id);
    if (u) {
      u.password = newP;
      u.twoFactor = document.getElementById("sec-2fa-toggle").checked;
    }
    currentUser.twoFactor = document.getElementById("sec-2fa-toggle").checked;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    saveDB(); closeModal("modal-security");
    logActivity("Security", `User ${currentUser.name} updated security credentials`);
    toast("পাসওয়ার্ড ও সিকিউরিটি সফলভাবে আপডেট হয়েছে");
  }
}

/* =======================================================================
   AUDIT & ACTIVITY LOGGER (INDIVIDUAL ITEM DELETE BY ADMIN ONLY)
======================================================================= */
function logActivity(category, description) {
  const currentUser = getActiveUser();
  const now = new Date();
  const timeStr = now.toLocaleDateString('en-GB') + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  DB.activityLogs = DB.activityLogs || [];
  DB.activityLogs.unshift({
    id: Date.now() + Math.floor(Math.random() * 1000),
    timestamp: timeStr,
    user: currentUser ? currentUser.name : "Admin",
    category,
    description
  });
  saveDB();
}

function renderActivityLogs() {
  const tbody = document.getElementById("activity-log-body");
  if (!tbody) return;

  const currentUser = getActiveUser();
  const isAdmin = currentUser && (currentUser.role === "Admin" || currentUser.name === "Super Admin");

  tbody.innerHTML = (DB.activityLogs && DB.activityLogs.length) ? DB.activityLogs.map(l => `
    <tr>
      <td class="mono muted">${l.timestamp}</td>
      <td><b>${l.user}</b></td>
      <td><span class="badge b-pending">${l.category}</span></td>
      <td>${l.description}</td>
      <td style="text-align:center">
        ${isAdmin ? `<button class="btn danger sm" onclick="deleteSingleActivityLog(${l.id})" title="Delete this record">✕</button>` : `<span class="muted" style="font-size:11px">—</span>`}
      </td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="tbl-empty">No activity records found</td></tr>`;
}

function deleteSingleActivityLog(id) {
  const currentUser = getActiveUser();
  if (!currentUser || (currentUser.role !== "Admin" && currentUser.name !== "Super Admin")) {
    toast("⚠️ দুঃখিত, শুধুমাত্র সুপার এডমিন হিস্টোরি মুছে ফেলতে পারবেন!");
    return;
  }

  if (confirm("আপনি কি এই নির্দিষ্ট হিস্টোরি রেকর্ডটি মুছে ফেলতে চান?")) {
    DB.activityLogs = (DB.activityLogs || []).filter(l => l.id !== id);
    saveDB();
    renderActivityLogs();
    toast("রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে");
  }
}

/* =======================================================================
   GLOBAL OMNI-SEARCH
======================================================================= */
function handleGlobalSearch(query) {
  const q = query.trim().toLowerCase();
  const resBox = document.getElementById("global-search-results");
  if (!q) { resBox.style.display = "none"; return; }

  let matches = [];

  DB.products.forEach(p => {
    if (p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q))) {
      matches.push({ type: "Product", title: p.name, sub: `SKU: ${p.sku || 'N/A'} | Stock: ${p.stock}`, view: "products" });
    }
  });

  DB.orders.forEach(o => {
    if (o.invoice.toLowerCase().includes(q) || o.name.toLowerCase().includes(q) || (o.phone && o.phone.includes(q)) || (o.tracking && o.tracking.toLowerCase().includes(q))) {
      matches.push({ type: "Retail Order", title: `${o.invoice} — ${o.name}`, sub: `Tracking: ${o.tracking || 'N/A'} | ${money(o.grandTotal)}`, view: "orders" });
    }
  });

  DB.wholesale.forEach(w => {
    if (w.invoice.toLowerCase().includes(q) || w.clientName.toLowerCase().includes(q) || (w.phone && w.phone.includes(q))) {
      matches.push({ type: "Wholesale", title: `${w.invoice} — ${w.clientName}`, sub: `Due: ${money(w.due)} | Bill: ${money(w.bill)}`, view: "wholesale" });
    }
  });

  if (!matches.length) {
    resBox.innerHTML = `<div style="padding:10px;text-align:center;color:var(--ink-soft);font-size:12px">কোনো ফলাফল পাওয়া যায়নি</div>`;
  } else {
    resBox.innerHTML = matches.slice(0, 8).map(m => `
      <div class="search-res-item" onclick="navigateToView('${m.view}')">
        <div><b>${m.title}</b><br><span class="muted" style="font-size:11px">${m.sub}</span></div>
        <span class="badge b-pending">${m.type}</span>
      </div>
    `).join("");
  }
  resBox.style.display = "block";
}

function navigateToView(viewName) {
  const sResults = document.getElementById("global-search-results");
  if (sResults) sResults.style.display = "none";
  const sInput = document.getElementById("global-omni-search");
  if (sInput) sInput.value = "";
  const btn = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (btn) btn.click();
}

/* =======================================================================
   AUTOMATION & NOTIFICATION CENTER
======================================================================= */
function toggleNotificationCenter() {
  const box = document.getElementById("notification-center-box");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function updateNotificationCenter() {
  let alerts = [];
  const today = new Date();

  DB.products.forEach(p => {
    const limit = p.alertLimit || 20;
    if (p.stock <= 0) {
      alerts.push({ type: "danger", title: `🔴 Out of Stock: ${p.name}`, sub: `স্টক শূন্য (0 pcs)! অবিলম্বে রিস্টক করুন।` });
    } else if (p.stock <= limit) {
      alerts.push({ type: "warning", title: `🟡 Low Stock: ${p.name}`, sub: `বর্তমান স্টক: ${p.stock} pcs (সীমা: ${limit} pcs)` });
    }

    if (p.batches) {
      p.batches.forEach(b => {
        if (b.expiryDate && b.qty > 0) {
          const exp = new Date(b.expiryDate);
          const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) alerts.push({ type: "danger", title: `⚠️ Batch Expired: ${p.name} (${b.batchNo})`, sub: `মেয়াদ শেষ হয়ে গেছে (${b.expiryDate})` });
          else if (diffDays <= 45) alerts.push({ type: "warning", title: `⏳ Expiry Alert: ${p.name} (${b.batchNo})`, sub: `${diffDays} দিন বাকি` });
        }
      });
    }
  });

  DB.packaging.forEach(pk => {
    if (pk.stock <= (pk.alertLimit || 20)) {
      alerts.push({ type: "warning", title: `📦 Low Packaging: ${pk.name}`, sub: `স্টক: ${pk.stock} pcs` });
    }
  });

  DB.wholesale.forEach(w => {
    if (w.due > 0) {
      alerts.push({ type: "info", title: `💵 Wholesale Due: ${w.clientName}`, sub: `বকেয়া পাওনা: ${money(w.due)} (${w.invoice})` });
    }
  });

  const badge = document.getElementById("notif-count-badge");
  const list = document.getElementById("notif-items-list");
  if (badge && list) {
    document.getElementById("notif-total-text").textContent = `${alerts.length} Alerts`;
    if (alerts.length > 0) {
      badge.style.display = "inline-block";
      badge.textContent = alerts.length;
      list.innerHTML = alerts.map(a => `<div class="notif-item"><div><b>${a.title}</b><br><span class="muted" style="font-size:11px">${a.sub}</span></div></div>`).join("");
    } else {
      badge.style.display = "none";
      list.innerHTML = `<div style="padding:14px; text-align:center; color:var(--ink-soft)">সবকিছু ঠিকঠাক আছে!</div>`;
    }
  }
}

/* =======================================================================
   COURIER MANAGEMENT & PERFORMANCE
======================================================================= */
function autoCalculateShippingCharge() {
  const area = document.getElementById("f-order-area").value;
  const weight = Math.max(1, Number(document.getElementById("f-order-weight").value) || 1);
  const rules = DB.settings.shippingRules || { insideDhaka: 80, outsideDhaka: 130, perKgCharge: 20 };
  
  let base = area === "inside" ? rules.insideDhaka : rules.outsideDhaka;
  let extraWeightCharge = (weight > 1) ? (weight - 1) * rules.perKgCharge : 0;
  document.getElementById("f-order-delivery").value = base + extraWeightCharge;
}

function saveShippingRules() {
  DB.settings.shippingRules = {
    insideDhaka: Number(document.getElementById("rule-dhaka").value) || 80,
    outsideDhaka: Number(document.getElementById("rule-outside").value) || 130,
    perKgCharge: Number(document.getElementById("rule-weight").value) || 20
  };
  DB.settings.courierApiKeys = {
    steadfast: document.getElementById("set-steadfast-key").value.trim(),
    pathao: document.getElementById("set-pathao-key").value.trim()
  };
  DB.settings.fraudCheckerApi = {
    apiKey: document.getElementById("set-fraud-api-key").value.trim(),
    apiUrl: document.getElementById("set-fraud-api-url").value.trim()
  };
  saveDB();
  logActivity("Settings", "Updated Shipping, Courier & Fraud API Settings");
  toast("শিপিং চার্জ ও API সেটিংস সংরক্ষিত হয়েছে");
}

function renderCourierManagement() {
  const couriers = ["Steadfast", "Pathao", "Redx", "Carrybee", "Sundarban", "SA Paribahan"];
  const metrics = {};

  couriers.forEach(c => {
    metrics[c] = { total: 0, delivered: 0, returned: 0, cancelled: 0, totalCost: 0, volume: 0 };
  });

  DB.orders.forEach(o => {
    const c = o.courier || "Steadfast";
    if (!metrics[c]) metrics[c] = { total: 0, delivered: 0, returned: 0, cancelled: 0, totalCost: 0, volume: 0 };
    metrics[c].total++;
    metrics[c].totalCost += Number(o.courierCost || 0);

    if (o.status === "delivered") {
      metrics[c].delivered++;
      metrics[c].volume += o.grandTotal;
    } else if (o.status === "returned") {
      metrics[c].returned++;
    } else if (o.status === "cancelled") {
      metrics[c].cancelled++;
    }
  });

  const kpiBox = document.getElementById("courier-kpi-cards");
  let overallDelivered = DB.orders.filter(o => o.status === "delivered").length;
  let overallTotal = DB.orders.length;
  let overallRate = overallTotal > 0 ? ((overallDelivered / overallTotal) * 100).toFixed(1) : 0;

  if (kpiBox) {
    kpiBox.innerHTML = `
      <div class="card stat stat-blue"><div class="label">মোট কুরিয়ার পার্সেল</div><div class="value">${overallTotal}</div></div>
      <div class="card stat stat-green"><div class="label">ডেলিভারি সম্পন্ন</div><div class="value">${overallDelivered}</div></div>
      <div class="card stat stat-teal"><div class="label">Delivery Success Rate</div><div class="value">${overallRate}%</div></div>
      <div class="card stat stat-orange"><div class="label">মোট কুরিয়ার খরচ</div><div class="value">${money(DB.orders.reduce((s, o) => s + Number(o.courierCost || 0), 0))}</div></div>
    `;
  }

  const tbody = document.getElementById("courier-perf-table-body");
  if (tbody) {
    tbody.innerHTML = couriers.map(c => {
      const m = metrics[c];
      const successRate = m.total > 0 ? ((m.delivered / m.total) * 100).toFixed(1) : "0.0";
      return `
        <tr>
          <td><b>${c}</b></td>
          <td class="num mono"><b>${m.total}</b></td>
          <td class="num mono text-emerald-600 font-bold">${m.delivered}</td>
          <td class="num mono text-rose-600">${m.cancelled}</td>
          <td class="num mono text-rose-600">${m.returned}</td>
          <td class="num mono"><b>${successRate}%</b></td>
          <td class="num mono text-amber-600">${money(m.totalCost)}</td>
          <td class="num mono text-blue-600"><b>${money(m.volume)}</b></td>
        </tr>
      `;
    }).join("");
  }

  const codTbody = document.getElementById("cod-reconciliation-table-body");
  if (codTbody) {
    codTbody.innerHTML = (DB.codSettlements && DB.codSettlements.length) ? DB.codSettlements.map(s => `
      <tr>
        <td class="mono muted">${s.date}</td>
        <td><b>${s.courier}</b></td>
        <td class="mono"><b>${s.batchRef}</b></td>
        <td class="num mono">${s.count}</td>
        <td class="num mono">${money(s.gross)}</td>
        <td class="num mono neg">-${money(s.deductions)}</td>
        <td class="num mono pos"><b>${money(s.net)}</b></td>
        <td><span class="badge b-delivered">${s.status}</span></td>
      </tr>
    `).join("") : `<tr><td colspan="8" class="tbl-empty">কোনো COD সেটেলমেন্ট নেই</td></tr>`;
  }
}

/* =======================================================================
   AUTOMATIC STOCK & PACKAGING DEDUCTIONS
======================================================================= */
function applyAutomaticDeductions(order) {
  if (order.stockDeducted) return;

  if (order.items && order.items.length) {
    order.items.forEach(it => {
      const prod = DB.products.find(p => p.id === it.productId || p.name.toLowerCase() === it.name.toLowerCase());
      if (prod) {
        deductFIFOBatches(prod, Number(it.qty));
      }
    });
  }

  const totalItemQty = order.items ? order.items.reduce((s, it) => s + Number(it.qty), 0) : 1;
  if (order.packagingId) {
    const pk = DB.packaging.find(p => p.id === order.packagingId);
    if (pk) pk.stock = Math.max(0, pk.stock - totalItemQty);
  }

  order.stockDeducted = true;
  saveDB();
}

function revertAutomaticDeductions(order) {
  if (!order.stockDeducted) return;

  if (order.items && order.items.length) {
    order.items.forEach(it => {
      const prod = DB.products.find(p => p.id === it.productId || p.name.toLowerCase() === it.name.toLowerCase());
      if (prod) {
        restoreFIFOBatches(prod, Number(it.qty));
      }
    });
  }

  const totalItemQty = order.items ? order.items.reduce((s, it) => s + Number(it.qty), 0) : 1;
  if (order.packagingId) {
    const pk = DB.packaging.find(p => p.id === order.packagingId);
    if (pk) pk.stock += totalItemQty;
  }

  order.stockDeducted = false;
  saveDB();
}

/* =======================================================================
   THEME, BRANDING & SECTIONS
======================================================================= */
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  DB.settings.theme = isDark ? "dark" : "light";
  document.getElementById("theme-icon").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  saveDB();
}

function applyTheme() {
  if (DB.settings.theme === "dark") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("theme-icon");
    if (icon) icon.className = "fa-solid fa-sun";
  }
}

function applyBranding() {
  const s = DB.settings;
  const els = {
    "display-app-name": s.appName || "Noorish ERP",
    "sidebar-app-name": s.appName || "Noorish ERP",
    "auth-app-name": s.appName || "Noorish ERP",
    "display-app-sub": s.appSub || "Business Suite",
    "page-head-title": `${s.appName || 'Noorish ERP'} — Enterprise Suite`
  };
  for (let id in els) {
    const el = document.getElementById(id);
    if (el) el.textContent = els[id];
  }

  const logoWrap = document.getElementById("brand-logo-container");
  if (logoWrap) {
    if (s.logoBase64) {
      logoWrap.innerHTML = `<img src="${s.logoBase64}" alt="Logo">`;
    } else {
      logoWrap.innerHTML = `<div class="mark" id="brand-avatar-fallback">${(s.appName || "S").charAt(0)}</div>`;
    }
  }

  if (s.sectionTitles) {
    Object.keys(s.sectionTitles).forEach(sec => {
      const navEl = document.getElementById(`nav-label-${sec}`);
      if (navEl) navEl.textContent = s.sectionTitles[sec];
      const viewEl = document.getElementById(`view-title-${sec}`);
      if (viewEl) viewEl.textContent = s.sectionTitles[sec];
    });
  }
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    DB.settings.logoBase64 = e.target.result;
    saveDB();
    applyBranding();
    toast("লোগো আপলোড সফল হয়েছে");
    document.getElementById("logo-preview-box").innerHTML = `<img src="${e.target.result}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;">`;
    logActivity("Branding", "Profile Logo Updated");
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  DB.settings.logoBase64 = "";
  saveDB();
  applyBranding();
  document.getElementById("logo-preview-box").innerHTML = "";
  toast("লোগো রিমুভ করা হয়েছে");
  logActivity("Branding", "Profile Logo Removed");
}

function saveGeneralSettings() {
  DB.settings.appName = document.getElementById("set-branding-name").value.trim() || "SKM Flow";
  DB.settings.appSub = document.getElementById("set-branding-sub").value.trim() || "Business Suite";
  DB.settings.shopName = document.getElementById("set-shopname").value.trim() || "Shop";
  DB.settings.phone = document.getElementById("set-phone").value.trim() || "";
  DB.settings.address = document.getElementById("set-address").value.trim() || "";
  DB.settings.currency = document.getElementById("set-currency").value.trim() || "৳";

  saveDB(); applyBranding(); renderAll(); toast("ব্র্যান্ডিং সেটিংস সেভ হয়েছে");
  logActivity("Settings", "General Branding Updated");
}

function saveSectionTitles() {
  DB.settings.sectionTitles = {
    dashboard: document.getElementById("set-lbl-dash").value.trim(),
    orders: document.getElementById("set-lbl-ord").value.trim(),
    couriers: document.getElementById("set-lbl-courier").value.trim(),
    "fraud-checker": document.getElementById("set-lbl-fraud").value.trim(),
    wholesale: document.getElementById("set-lbl-ws").value.trim(),
    products: document.getElementById("set-lbl-prod").value.trim(),
    packaging: document.getElementById("set-lbl-pack").value.trim(),
    accounting: document.getElementById("set-lbl-acc").value.trim(),
    customers: "কাস্টমার ও ফ্রড মিটার",
    users: "স্টাফ ও পারমিশন",
    reports: "Reports",
    activity: "Activity Log",
    settings: "সেটিংস ও ব্যাকআপ"
  };
  saveDB(); applyBranding(); toast("সেকশন নাম আপডেট হয়েছে");
  logActivity("Settings", "Dashboard Sections Customized");
}

/* =======================================================================
   DRAWER NAVIGATION CONTROLLER
======================================================================= */
const appSidebar = document.getElementById("app-sidebar");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

if (document.getElementById("btn-open-sidebar")) {
  document.getElementById("btn-open-sidebar").addEventListener("click", () => {
    appSidebar.classList.add("open");
    sidebarBackdrop.classList.add("active");
  });
}

function closeSidebar() {
  if (appSidebar) appSidebar.classList.remove("open");
  if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
}

if (document.getElementById("btn-close-sidebar")) document.getElementById("btn-close-sidebar").addEventListener("click", closeSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

document.querySelectorAll(".nav-item").forEach(el => {
  el.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    el.classList.add("active");
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = el.dataset.view;
    const viewEl = document.getElementById("view-" + target);
    if (viewEl) viewEl.classList.add("active");
    
    closeSidebar();

    if (target === "dashboard") renderDashboard();
    if (target === "orders") renderOrders();
    if (target === "couriers") renderCourierManagement();
    if (target === "wholesale") renderWholesale();
    if (target === "products") renderProducts();
    if (target === "packaging") renderPackaging();
    if (target === "accounting") renderAccounting();
    if (target === "customers") renderCustomers();
    if (target === "users") renderUsers();
    if (target === "reports") renderReports();
    if (target === "activity") renderActivityLogs();
    if (target === "settings") renderSettings();
  });
});

function openModal(id) { 
  const el = document.getElementById(id);
  if (el) el.classList.add("open"); 
}
function closeModal(id) { 
  const el = document.getElementById(id);
  if (el) el.classList.remove("open"); 
}
document.querySelectorAll("[data-close]").forEach(b => {
  b.addEventListener("click", (e) => e.target.closest(".modal-bg").classList.remove("open"));
});

/* =======================================================================
   DASHBOARD CONTROLLER
======================================================================= */
document.querySelectorAll("#dash-period button").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll("#dash-period button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    dashPeriod = b.dataset.p;

    const customBox = document.getElementById("custom-date-container");
    if (dashPeriod === "custom") {
      customBox.style.display = "flex";
      if (!document.getElementById("dash-start-date").value) {
        const d = new Date(); d.setDate(d.getDate() - 30);
        document.getElementById("dash-start-date").value = d.toISOString().slice(0, 10);
        document.getElementById("dash-end-date").value = todayStr();
      }
    } else {
      customBox.style.display = "none";
    }
    renderDashboard();
  });
});

function getPeriodFilteredData(period) {
  const today = todayStr();
  let ordList = DB.orders;
  let expList = DB.expenses;

  if (period === "today") {
    ordList = DB.orders.filter(o => o.date === today);
    expList = DB.expenses.filter(e => e.date === today);
  } else if (period === "7days") {
    const d = new Date(); d.setDate(d.getDate() - 7);
    const minD = d.toISOString().slice(0, 10);
    ordList = DB.orders.filter(o => o.date >= minD);
    expList = DB.expenses.filter(e => e.date >= minD);
  } else if (period === "30days") {
    const d = new Date(); d.setDate(d.getDate() - 30);
    const minD = d.toISOString().slice(0, 10);
    ordList = DB.orders.filter(o => o.date >= minD);
    expList = DB.expenses.filter(e => e.date >= minD);
  } else if (period === "custom") {
    const start = document.getElementById("dash-start-date").value;
    const end = document.getElementById("dash-end-date").value;
    if (start && end) {
      ordList = DB.orders.filter(o => o.date >= start && o.date <= end);
      expList = DB.expenses.filter(e => e.date >= start && e.date <= end);
    }
  }
  return { orders: ordList, expenses: expList };
}

function renderDashboard() {
  const { orders, expenses } = getPeriodFilteredData(dashPeriod);

  const delivered = orders.filter(o => o.status === "delivered");
  const returned = orders.filter(o => o.status === "returned");

  const revenue = delivered.reduce((s, o) => s + o.grandTotal, 0);
  const cogs = delivered.reduce((s, o) => s + o.totalCOGS, 0);
  const genExp = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const returnLoss = returned.reduce((s, o) => s + Number(o.delivery || 0), 0);
  const totalExp = genExp + returnLoss;
  const netProfit = revenue - cogs - totalExp;

  document.getElementById("stat-revenue").textContent = money(revenue);
  document.getElementById("stat-cogs").textContent = money(cogs);
  document.getElementById("stat-exp").textContent = money(totalExp);
  document.getElementById("stat-profit").textContent = money(netProfit);

  const profitCard = document.getElementById("stat-profit-card");
  if (profitCard) profitCard.className = `card stat ${netProfit >= 0 ? "stat-green" : "stat-red"}`;

  const statuses = ["pending", "shipped", "delivered", "returned", "cancelled"];
  const statusLabels = { pending: "Pending", shipped: "Shipped", delivered: "Delivered", returned: "Returned", cancelled: "Cancelled" };

  const statusGrid = document.getElementById("dash-status-grid");
  if (statusGrid) {
    statusGrid.innerHTML = statuses.map(st => `
      <div class="card stat stat-blue">
        <div class="label">${statusLabels[st]}</div>
        <div class="value">${orders.filter(o => o.status === st).length}</div>
      </div>
    `).join("");
  }

  const recent = [...DB.orders].sort((a, b) => (b.date + b.invoice).localeCompare(a.date + a.invoice)).slice(0, 6);
  const tbody = document.getElementById("dash-recent");
  if (tbody) {
    tbody.innerHTML = recent.length ? recent.map(o => `
      <tr>
        <td><b>${o.invoice}</b><br><span class="muted mono" style="font-size:10.5px">${o.date}</span></td>
        <td>${o.name}<br><span class="muted" style="font-size:10.5px">${o.address || "—"}</span></td>
        <td class="mono"><b>${o.tracking || "—"}</b></td>
        <td>${o.courier}</td>
        <td>${statusBadge(o.status)}</td>
        <td class="num mono"><b>${money(o.grandTotal)}</b></td>
      </tr>`).join("") : `<tr><td colspan="6" class="tbl-empty">No records found</td></tr>`;
  }

  updateNotificationCenter();
}

/* =======================================================================
   WHOLESALE MODULE
======================================================================= */
function openWholesaleModal(editId = null) {
  populateWholesaleCartSelectors();

  if (editId) {
    const w = DB.wholesale.find(x => x.id === editId);
    if (!w) return;
    editingWholesaleId = editId;
    document.getElementById("ws-modal-title").textContent = "Edit Wholesale Order — " + w.invoice;
    document.getElementById("f-ws-date").value = w.date;
    document.getElementById("f-ws-name").value = w.clientName;
    document.getElementById("f-ws-phone").value = w.phone || "";
    document.getElementById("f-ws-address").value = w.address || "";
    document.getElementById("f-ws-courier").value = w.courier || "Sundarban";
    document.getElementById("f-ws-tracking").value = w.tracking || "";
    document.getElementById("f-ws-courier-cost").value = w.courierCost || 0;
    document.getElementById("f-ws-packaging-cost").value = w.packagingCost || 0;
    document.getElementById("f-ws-paid").value = w.paid || 0;
    document.getElementById("f-ws-status").value = w.status || "pending";
    activeWholesaleCart = JSON.parse(JSON.stringify(w.items || []));
  } else {
    editingWholesaleId = null;
    activeWholesaleCart = [];
    document.getElementById("ws-modal-title").textContent = "New Wholesale Order Entry";
    document.getElementById("f-ws-date").value = todayStr();
    document.getElementById("f-ws-name").value = "";
    document.getElementById("f-ws-phone").value = "";
    document.getElementById("f-ws-address").value = "";
    document.getElementById("f-ws-courier").value = "Sundarban";
    document.getElementById("f-ws-tracking").value = "";
    document.getElementById("f-ws-courier-cost").value = 0;
    document.getElementById("f-ws-packaging-cost").value = 0;
    document.getElementById("f-ws-paid").value = 0;
    document.getElementById("f-ws-status").value = "pending";
  }
  
  renderWholesaleCartTable();
  openModal("modal-wholesale");
}

function populateWholesaleCartSelectors() {
  const sel = document.getElementById("ws-cart-product-select");
  if (!sel) return;
  sel.innerHTML = DB.products.map(p => `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`).join("");
  syncWholesaleCartInputs();
}

const wsCartSelect = document.getElementById("ws-cart-product-select");
if (wsCartSelect) wsCartSelect.addEventListener("change", syncWholesaleCartInputs);

function syncWholesaleCartInputs() {
  const pid = Number(document.getElementById("ws-cart-product-select").value);
  const p = DB.products.find(x => x.id === pid);
  if (p) {
    const fifoCost = getFIFOCost(p, 10);
    document.getElementById("ws-cart-price").value = Math.round(fifoCost * 1.15) || p.sellPrice;
    document.getElementById("ws-cart-cost").value = Math.round(fifoCost);
  }
}

function addWholesaleCartItem() {
  const pid = Number(document.getElementById("ws-cart-product-select").value);
  const p = DB.products.find(x => x.id === pid);
  if (!p) return;

  const qty = Number(document.getElementById("ws-cart-qty").value) || 1;
  const price = Number(document.getElementById("ws-cart-price").value) || 0;
  const cost = Number(document.getElementById("ws-cart-cost").value) || 0;

  activeWholesaleCart.push({ productId: p.id, name: p.name, qty, price, cost });
  renderWholesaleCartTable();
}

function removeWholesaleCartItem(idx) {
  activeWholesaleCart.splice(idx, 1);
  renderWholesaleCartTable();
}

function renderWholesaleCartTable() {
  const tbody = document.getElementById("ws-cart-items-body");
  if (!tbody) return;
  tbody.innerHTML = activeWholesaleCart.map((it, idx) => `
    <tr>
      <td>${it.name}</td>
      <td class="num">${it.qty}</td>
      <td class="num mono">${money(it.price)}</td>
      <td class="num mono text-amber-600">${money(it.cost)}</td>
      <td class="num mono"><b>${money(it.price * it.qty)}</b></td>
      <td><button type="button" class="btn danger sm" onclick="removeWholesaleCartItem(${idx})">✕</button></td>
    </tr>
  `).join("");

  const totalBill = activeWholesaleCart.reduce((s, it) => s + (it.price * it.qty), 0);
  document.getElementById("f-ws-bill").value = totalBill;
  calculateWholesaleFinancials();
}

function calculateWholesaleFinancials() {
  const bill = Number(document.getElementById("f-ws-bill").value) || 0;
  const paid = Number(document.getElementById("f-ws-paid").value) || 0;
  document.getElementById("f-ws-due").value = Math.max(0, bill - paid);
}

document.getElementById("btn-save-wholesale").addEventListener("click", () => {
  if (!activeWholesaleCart.length) { toast("কার্টে পণ্য যোগ করুন"); return; }
  const clientName = document.getElementById("f-ws-name").value.trim();
  if (!clientName) { toast("ক্লায়েন্টের নাম দিন"); return; }

  const date = document.getElementById("f-ws-date").value || todayStr();
  const phone = document.getElementById("f-ws-phone").value.trim();
  const address = document.getElementById("f-ws-address").value.trim();
  const courier = document.getElementById("f-ws-courier").value;
  const tracking = document.getElementById("f-ws-tracking").value.trim();
  const courierCost = Number(document.getElementById("f-ws-courier-cost").value) || 0;
  const packagingCost = Number(document.getElementById("f-ws-packaging-cost").value) || 0;
  const bill = Number(document.getElementById("f-ws-bill").value) || 0;
  const paid = Number(document.getElementById("f-ws-paid").value) || 0;
  const due = Math.max(0, bill - paid);
  const status = document.getElementById("f-ws-status").value;

  const productCost = activeWholesaleCart.reduce((s, it) => s + (it.cost * it.qty), 0);
  const totalCost = productCost + courierCost + packagingCost;
  const profit = bill - totalCost;

  if (editingWholesaleId) {
    const idx = DB.wholesale.findIndex(w => w.id === editingWholesaleId);
    if (idx !== -1) {
      DB.wholesale[idx] = {
        ...DB.wholesale[idx],
        date, clientName, phone, address, courier, tracking,
        courierCost, packagingCost, items: [...activeWholesaleCart],
        bill, paid, due, totalCost, profit, status
      };
      logActivity("Wholesale", `Updated wholesale order: ${DB.wholesale[idx].invoice}`);
      toast("পাইকারি অর্ডার সফলভাবে আপডেট হয়েছে");
    }
  } else {
    const newInvoice = nextWholesaleInvoice();
    DB.wholesale.push({
      id: Date.now(), invoice: newInvoice,
      date, clientName, phone, address, courier, tracking,
      courierCost, packagingCost, items: [...activeWholesaleCart],
      bill, paid, due, totalCost, profit, status
    });
    logActivity("Wholesale", `Created wholesale order: ${newInvoice}`);
    toast("পাইকারি অর্ডার সেভ হয়েছে");
  }

  saveDB(); closeModal("modal-wholesale"); renderWholesale();
});

document.querySelectorAll("#ws-tabs .tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll("#ws-tabs .tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    wholesaleStatusFilter = t.dataset.wsS;
    renderWholesale();
  });
});

function quickWholesaleStatus(id, st) {
  const w = DB.wholesale.find(x => x.id === id);
  if (!w) return;
  w.status = st;
  saveDB();
  logActivity("Wholesale", `Wholesale ${w.invoice} status updated to: ${st}`);
  renderWholesale();
  toast("Status Updated");
}

function renderWholesale() {
  const searchTerm = (document.getElementById("ws-search") ? document.getElementById("ws-search").value : "").toLowerCase();
  let list = [...DB.wholesale].sort((a, b) => (b.date + b.invoice).localeCompare(a.date + a.invoice));

  if (wholesaleStatusFilter !== "all") list = list.filter(w => (w.status || "pending") === wholesaleStatusFilter);
  if (searchTerm) {
    list = list.filter(w =>
      w.clientName.toLowerCase().includes(searchTerm) ||
      (w.phone || "").includes(searchTerm) ||
      w.invoice.toLowerCase().includes(searchTerm)
    );
  }

  const totalSales = DB.wholesale.reduce((s, w) => s + w.bill, 0);
  const totalPaid = DB.wholesale.reduce((s, w) => s + w.paid, 0);
  const totalDue = DB.wholesale.reduce((s, w) => s + w.due, 0);
  const totalProfit = DB.wholesale.reduce((s, w) => s + w.profit, 0);

  document.getElementById("ws-stat-total").textContent = money(totalSales);
  document.getElementById("ws-stat-paid").textContent = money(totalPaid);
  document.getElementById("ws-stat-due").textContent = money(totalDue);
  document.getElementById("ws-stat-profit").textContent = money(totalProfit);

  const tbody = document.getElementById("ws-table-body");
  if (!tbody) return;
  tbody.innerHTML = list.length ? list.map(w => `
    <tr>
      <td><b>${w.invoice}</b></td>
      <td class="mono muted">${w.date}</td>
      <td><b>${w.clientName}</b><br><span class="muted mono" style="font-size:11px">${w.phone || "—"}</span></td>
      <td style="max-width:200px; font-size:11.5px">${w.items ? w.items.map(i => `${i.name} (${i.qty})`).join(", ") : "—"}</td>
      <td><b>${w.courier || "Direct"}</b><br><span class="mono muted" style="font-size:10px">${w.tracking || "No CN"}</span></td>
      <td class="num mono"><b>${money(w.bill)}</b></td>
      <td class="num mono text-emerald-600 font-bold">${money(w.paid)}</td>
      <td class="num mono text-rose-600 font-bold">${money(w.due)}</td>
      <td class="num mono text-amber-600">${money(w.totalCost)}</td>
      <td class="num mono text-indigo-600 font-bold">${money(w.profit)}</td>
      <td>
        <select onchange="quickWholesaleStatus(${w.id}, this.value)" style="border:1px solid var(--line);border-radius:6px;padding:3px;font-size:11px">
          ${["pending", "shipped", "delivered", "cancelled"].map(s => `<option value="${s}" ${(w.status || 'pending') === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </td>
      <td style="text-align:center">
        <button class="btn ghost sm" onclick="openWholesaleModal(${w.id})" title="Edit Order Details">Edit</button>
        <button class="btn danger sm" onclick="deleteWholesale(${w.id})">✕</button>
      </td>
    </tr>
  `).join("") : `<tr><td colspan="12" class="tbl-empty">কোনো পাইকারি রেকর্ড নেই</td></tr>`;
}

function deleteWholesale(id) {
  if (!confirm("পাইকারি অর্ডারটি মুছে ফেলতে চান?")) return;
  DB.wholesale = DB.wholesale.filter(x => x.id !== id);
  saveDB(); renderWholesale();
}

/* =======================================================================
   PRODUCTS & FIFO BATCHES CONTROLLER
======================================================================= */
function openNewProductModal() {
  editingProductId = null;
  document.getElementById("product-modal-title").textContent = "Add New Product & Batch";
  document.getElementById("f-prod-name").value = "";
  document.getElementById("f-prod-sku").value = "";
  document.getElementById("f-prod-sell").value = "";
  document.getElementById("f-prod-stock").value = 0;
  document.getElementById("f-prod-alert").value = 20;
  document.getElementById("f-prod-cost").value = "";
  document.getElementById("f-prod-expiry").value = "";
  document.getElementById("f-prod-batch").value = `BATCH-${new Date().getFullYear()}-01`;
  document.getElementById("prod-cost-history").innerHTML = "";
  openModal("modal-product");
}

function editProduct(id) {
  const p = DB.products.find(x => x.id === id);
  if (!p) return;
  editingProductId = id;
  document.getElementById("product-modal-title").textContent = "Edit Product — " + p.name;
  document.getElementById("f-prod-name").value = p.name;
  document.getElementById("f-prod-sku").value = p.sku || "";
  document.getElementById("f-prod-sell").value = p.sellPrice;
  document.getElementById("f-prod-stock").value = p.stock;
  document.getElementById("f-prod-alert").value = p.alertLimit || 20;
  
  const currentCost = getFIFOCost(p, 1);
  document.getElementById("f-prod-cost").value = currentCost;

  const hist = document.getElementById("prod-cost-history");
  if (p.batches && p.batches.length) {
    hist.innerHTML = `<div class="section-title" style="margin:8px 0 4px">Active FIFO Batches</div>` +
      p.batches.map(b => `
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11.5px;border-bottom:1px dashed var(--line)">
          <span><b>${b.batchNo}</b> (Exp: ${b.expiryDate || '—'})</span><span class="mono">${b.qty} pcs @ ${money(b.cost)}</span>
        </div>`).join("");
  } else hist.innerHTML = "";
  openModal("modal-product");
}

document.getElementById("btn-save-product").addEventListener("click", () => {
  const name = document.getElementById("f-prod-name").value.trim();
  const sku = document.getElementById("f-prod-sku").value.trim();
  const sell = Number(document.getElementById("f-prod-sell").value) || 0;
  const stock = Number(document.getElementById("f-prod-stock").value) || 0;
  const alertLimit = Number(document.getElementById("f-prod-alert").value) || 20;
  const cost = Number(document.getElementById("f-prod-cost").value) || 0;
  const expiryDate = document.getElementById("f-prod-expiry").value;
  const batchNo = document.getElementById("f-prod-batch").value.trim() || "LOT-01";
  if (!name) { toast("প্রোডাক্টের নাম দিন"); return; }

  if (editingProductId) {
    const p = DB.products.find(x => x.id === editingProductId);
    p.name = name; 
    p.sku = sku; 
    p.sellPrice = sell; 
    p.stock = stock; 
    p.alertLimit = alertLimit;
    
    if (p.batches && p.batches.length > 0) {
      p.batches[0].cost = cost;
    } else {
      p.batches = [{ batchNo, qty: stock, cost, expiryDate }];
    }
    p.costHistory = p.costHistory || [];
    p.costHistory.push({ cost, date: todayStr() });

    logActivity("Product Edit", `Updated product: ${name} (Unit Cost: ৳${cost})`);
    toast("প্রোডাক্ট ও ইউনিট কস্ট আপডেট হয়েছে");
  } else {
    DB.products.push({
      id: Date.now(), name, sku, sellPrice: sell, stock, alertLimit,
      batches: [{ batchNo, qty: stock, cost, expiryDate }],
      costHistory: [{ cost, date: todayStr() }]
    });
    logActivity("Product Create", `Created product: ${name} (Unit Cost: ৳${cost})`);
    toast("নতুন প্রোডাক্ট ও ব্যাচ যোগ হয়েছে");
  }

  saveDB(); closeModal("modal-product"); renderProducts();
});

function deleteProduct(id) {
  const currentUser = getActiveUser();
  if (currentUser && currentUser.permissions && !currentUser.permissions.productDelete) {
    toast("আপনার প্রোডাক্ট মুছে ফেলার পারমিশন নেই ❌");
    return;
  }
  if (!confirm("প্রোডাক্টটি মুছে ফেলবেন?")) return;
  const p = DB.products.find(x => x.id === id);
  DB.products = DB.products.filter(p => p.id !== id);
  saveDB();
  logActivity("Product Delete", `Deleted product: ${p ? p.name : id}`);
  renderProducts();
}

function renderProducts() {
  const tbody = document.getElementById("product-table-body");
  if (!tbody) return;
  
  let totalStockQty = 0;
  let totalStockVal = 0;
  DB.products.forEach(p => {
    totalStockQty += Number(p.stock || 0);
    const avgCost = getFIFOCost(p, p.stock || 1);
    totalStockVal += (avgCost * Number(p.stock || 0));
  });

  document.getElementById("prod-total-items").textContent = DB.products.length;
  document.getElementById("prod-total-stock-qty").textContent = `${totalStockQty} pcs`;
  document.getElementById("prod-total-stock-val").textContent = money(totalStockVal);

  tbody.innerHTML = DB.products.map(p => {
    const limit = p.alertLimit || 20;
    const fifoCost = getFIFOCost(p, 1);
    const batchInfo = p.batches ? p.batches.map(b => `${b.batchNo} (${b.qty})`).join(", ") : "Main";

    let stockBadge = `<span class="badge b-in-stock">🟢 In Stock</span>`;
    if (p.stock <= 0) stockBadge = `<span class="badge b-out-stock">🔴 Out of Stock</span>`;
    else if (p.stock <= limit) stockBadge = `<span class="badge b-low-stock">🟡 Low Stock</span>`;

    return `
      <tr>
        <td><b>${p.name}</b></td>
        <td class="mono muted">${p.sku || "—"}</td>
        <td style="font-size:11px">${batchInfo}</td>
        <td class="num mono text-amber-600"><b>${money(fifoCost)}</b></td>
        <td class="num mono">${money(p.sellPrice)}</td>
        <td class="num mono"><b>${p.stock}</b></td>
        <td class="num mono muted">${limit} pcs</td>
        <td class="num mono text-blue-600"><b>${money(fifoCost * p.stock)}</b></td>
        <td>${stockBadge}</td>
        <td>
          <button class="btn ghost sm" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn danger sm" onclick="deleteProduct(${p.id})">✕</button>
        </td>
      </tr>`;
  }).join("");
}

/* =======================================================================
   PACKAGING INVENTORY
======================================================================= */
if (document.getElementById("btn-new-packaging")) {
  document.getElementById("btn-new-packaging").addEventListener("click", () => {
    document.getElementById("pack-modal-title").textContent = "New Packaging Material";
    document.getElementById("f-pack-name").value = "";
    document.getElementById("f-pack-cost").value = 5;
    document.getElementById("f-pack-stock").value = 100;
    document.getElementById("f-pack-alert").value = 20;
    openModal("modal-packaging");
  });
}

document.getElementById("btn-save-packaging").addEventListener("click", () => {
  const name = document.getElementById("f-pack-name").value.trim();
  const cost = Number(document.getElementById("f-pack-cost").value) || 0;
  const stock = Number(document.getElementById("f-pack-stock").value) || 0;
  const alertLimit = Number(document.getElementById("f-pack-alert").value) || 20;
  if (!name) return;

  DB.packaging.push({ id: Date.now(), name, cost, stock, alertLimit });
  logActivity("Inventory", `Packaging added: ${name}`);
  saveDB(); closeModal("modal-packaging"); renderPackaging(); toast("প্যাকেজিং সেভ হয়েছে");
});

function renderPackaging() {
  const tbody = document.getElementById("packaging-table-body");
  if (!tbody) return;
  const totalQty = DB.packaging.reduce((s, pk) => s + Number(pk.stock || 0), 0);
  const totalVal = DB.packaging.reduce((s, pk) => s + (pk.cost * pk.stock), 0);
  document.getElementById("pack-summary-types").textContent = `${DB.packaging.length} Types`;
  document.getElementById("pack-summary-qty").textContent = `${totalQty} pcs`;
  document.getElementById("pack-summary-val").textContent = money(totalVal);

  tbody.innerHTML = DB.packaging.map(pk => {
    const limit = pk.alertLimit || 20;
    const isLow = pk.stock <= limit;
    return `
      <tr>
        <td><b>${pk.name}</b></td>
        <td class="num mono">৳${pk.cost}</td>
        <td class="num mono"><b>${pk.stock}</b></td>
        <td class="num mono muted">${limit} pcs</td>
        <td class="num mono text-blue-600">৳${pk.cost * pk.stock}</td>
        <td><span class="badge ${isLow ? 'b-low-stock' : 'b-in-stock'}">${isLow ? '⚠️ Low Stock' : 'Normal'}</span></td>
        <td><button class="btn danger sm" onclick="deletePackaging(${pk.id})">✕</button></td>
      </tr>
    `;
  }).join("");
}

function deletePackaging(id) {
  DB.packaging = DB.packaging.filter(x => x.id !== id);
  saveDB(); renderPackaging();
}

/* =======================================================================
   RETAIL ORDERS, PACKAGING PREVIEW & FULL EDIT
======================================================================= */
function parseAIMessage() {
  const text = document.getElementById("ai-paste-box").value;
  if (!text) return;
  const phoneMatch = text.match(/(?:(?:\+8801|8801|01))[3-9]\d{8}/);
  if (phoneMatch) {
    document.getElementById("f-order-phone").value = phoneMatch[0];
    evaluateCustomerRisk(phoneMatch[0]);
  }
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length > 0) document.getElementById("f-order-name").value = lines[0].replace(/নাম|Name|Customer|:/gi, "").trim();
  const addressLine = lines.find(l => /ঠিকানা|Address|Road|House|Dhaka|Chittagong|থানা|জেলা/i.test(l));
  if (addressLine) document.getElementById("f-order-address").value = addressLine.replace(/ঠিকানা|Address|:/gi, "").trim();
  toast("AI পার্সিং সম্পন্ন");
}

function populateCartSelectors() {
  const sel = document.getElementById("cart-product-select");
  if (!sel) return;
  sel.innerHTML = DB.products.map(p => `<option value="${p.id}">${p.name} (Stock: ${p.stock})</option>`).join("");
  syncCartInputs();
  const packSel = document.getElementById("f-order-packaging");
  if (packSel) {
    packSel.innerHTML = `<option value="0">None (৳0)</option>` + DB.packaging.map(pk => `<option value="${pk.id}">${pk.name} (+৳${pk.cost}) [Stock: ${pk.stock}]</option>`).join("");
  }
}

const cartSelect = document.getElementById("cart-product-select");
if (cartSelect) cartSelect.addEventListener("change", syncCartInputs);

function syncCartInputs() {
  const p = DB.products.find(x => x.id === Number(document.getElementById("cart-product-select").value));
  if (p) {
    document.getElementById("cart-price").value = p.sellPrice;
    document.getElementById("cart-cost").value = Math.round(getFIFOCost(p, 1));
  }
}

function addItemToCart() {
  const p = DB.products.find(x => x.id === Number(document.getElementById("cart-product-select").value));
  if (!p) return;
  const qty = Number(document.getElementById("cart-qty").value) || 1;
  const fifoCost = getFIFOCost(p, qty);
  activeCart.push({ productId: p.id, name: p.name, qty, price: Number(document.getElementById("cart-price").value) || 0, cost: fifoCost });
  renderCartTable();
}

function removeCartItem(idx) { activeCart.splice(idx, 1); renderCartTable(); }

function renderCartTable() {
  const tbody = document.getElementById("cart-items-body");
  if (!tbody) return;
  tbody.innerHTML = activeCart.map((item, idx) => `
    <tr>
      <td>${item.name}</td>
      <td class="num">${item.qty}</td>
      <td class="num mono">${money(item.price)}</td>
      <td class="num mono text-amber-600">${money(item.cost)}</td>
      <td class="num mono"><b>${money(item.price * item.qty)}</b></td>
      <td><button type="button" class="btn danger sm" onclick="removeCartItem(${idx})">✕</button></td>
    </tr>
  `).join("");
}

function openNewOrderModal() {
  const currentUser = getActiveUser();
  if (currentUser && currentUser.permissions && !currentUser.permissions.orderCreate) {
    toast("আপনার অর্ডার তৈরির পারমিশন নেই ❌"); return;
  }
  editingOrderId = null;
  activeCart = [];
  document.getElementById("order-modal-title").textContent = "New Order Entry";
  document.getElementById("ai-paste-box").value = "";
  document.getElementById("customer-risk-indicator").style.display = "none";
  document.getElementById("f-order-date").value = todayStr();
  document.getElementById("f-order-name").value = "";
  document.getElementById("f-order-phone").value = "";
  document.getElementById("f-order-address").value = "";
  document.getElementById("f-order-tracking").value = "";
  document.getElementById("f-order-courier-cost").value = 60;
  document.getElementById("f-order-delivery").value = 80;
  document.getElementById("f-order-advance").value = 0;
  document.getElementById("f-order-discount").value = 0;
  document.getElementById("f-order-status").value = "pending";
  document.getElementById("live-tracking-btn-box").innerHTML = "";
  populateCartSelectors();
  renderCartTable();
  openModal("modal-order");
}

function editOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;

  editingOrderId = id;
  document.getElementById("order-modal-title").textContent = "Edit Order — " + o.invoice;
  document.getElementById("ai-paste-box").value = "";
  document.getElementById("f-order-date").value = o.date;
  document.getElementById("f-order-courier").value = o.courier || "Steadfast";
  document.getElementById("f-order-tracking").value = o.tracking || "";
  document.getElementById("f-order-courier-cost").value = o.courierCost || 60;
  document.getElementById("f-order-name").value = o.name;
  document.getElementById("f-order-phone").value = o.phone;
  document.getElementById("f-order-address").value = o.address || "";
  document.getElementById("f-order-delivery").value = o.delivery || 0;
  document.getElementById("f-order-advance").value = o.advance || 0;
  document.getElementById("f-order-discount").value = o.discount || 0;
  document.getElementById("f-order-status").value = o.status || "pending";
  
  populateCartSelectors();
  document.getElementById("f-order-packaging").value = o.packagingId || 0;
  activeCart = JSON.parse(JSON.stringify(o.items || []));
  renderCartTable();
  syncCourierLiveUrlPreview();
  evaluateCustomerRisk(o.phone);
  openModal("modal-order");
}

document.getElementById("btn-save-order").addEventListener("click", () => {
  if (!activeCart.length) { toast("কার্টে প্রোডাক্ট যোগ করুন"); return; }
  const name = document.getElementById("f-order-name").value.trim();
  const phone = document.getElementById("f-order-phone").value.trim();
  if (!name || !phone) { toast("নাম ও ফোন দিন"); return; }

  const packId = Number(document.getElementById("f-order-packaging").value);
  const packObj = DB.packaging.find(pk => pk.id === packId);
  const packCost = packObj ? packObj.cost : 0;
  const courierCost = Number(document.getElementById("f-order-courier-cost").value) || 0;

  const itemsCostTotal = activeCart.reduce((s, it) => s + (it.cost * it.qty), 0);
  const itemsPriceTotal = activeCart.reduce((s, it) => s + (it.price * it.qty), 0);
  const status = document.getElementById("f-order-status").value;

  const data = {
    date: document.getElementById("f-order-date").value || todayStr(),
    courier: document.getElementById("f-order-courier").value,
    tracking: document.getElementById("f-order-tracking").value.trim(),
    courierCost, name, phone,
    address: document.getElementById("f-order-address").value.trim(),
    items: [...activeCart],
    packagingId: packId,
    packagingCost: packCost,
    totalCOGS: itemsCostTotal + packCost,
    subtotal: itemsPriceTotal,
    delivery: Number(document.getElementById("f-order-delivery").value) || 0,
    advance: Number(document.getElementById("f-order-advance").value) || 0,
    discount: Number(document.getElementById("f-order-discount").value) || 0,
    status
  };

  data.grandTotal = data.subtotal + data.delivery - data.discount;
  data.due = Math.max(0, data.grandTotal - data.advance);

  const currentUser = getActiveUser();
  if (editingOrderId) {
    if (currentUser && currentUser.permissions && !currentUser.permissions.orderEdit) {
      toast("আপনার অর্ডার এডিটের পারমিশন নেই ❌"); return;
    }
    const idx = DB.orders.findIndex(x => x.id === editingOrderId);
    const prevOrder = DB.orders[idx];
    if (prevOrder.stockDeducted && status !== "delivered") revertAutomaticDeductions(prevOrder);
    DB.orders[idx] = { ...DB.orders[idx], ...data };
    if (status === "delivered") applyAutomaticDeductions(DB.orders[idx]);
    logActivity("Orders", `Order updated: ${prevOrder.invoice}`);
    toast("অর্ডার আপডেট হয়েছে");
  } else {
    const newInvoice = nextInvoice();
    const newOrd = { id: Date.now(), invoice: newInvoice, stockDeducted: false, ...data };
    if (status === "delivered") applyAutomaticDeductions(newOrd);
    DB.orders.push(newOrd);
    logActivity("Orders", `New order created: ${newInvoice}`);
    toast("নতুন অর্ডার সেভ হয়েছে");
  }

  saveDB(); closeModal("modal-order"); renderOrders();
});

function quickStatus(id, st) {
  const currentUser = getActiveUser();
  if (currentUser && currentUser.permissions && !currentUser.permissions.orderEdit) {
    toast("আপনার স্ট্যাটাস পরিবর্তনের পারমিশন নেই ❌"); return;
  }
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  const oldSt = o.status;
  o.status = st;

  if (st === "delivered" && !o.stockDeducted) {
    applyAutomaticDeductions(o);
    toast("অর্ডার Delivered: স্টক থেকে পণ্য ও প্যাকেজিং কমেছে");
  } else if (oldSt === "delivered" && st !== "delivered" && o.stockDeducted) {
    revertAutomaticDeductions(o);
    toast("স্টক পুনরায় ফেরত দেওয়া হয়েছে");
  }

  saveDB();
  logActivity("Orders", `Order ${o.invoice} status: ${st}`);
  renderOrders();
}

document.querySelectorAll("#order-tabs .tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll("#order-tabs .tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    orderStatusFilter = t.dataset.s;
    renderOrders();
  });
});

const orderSearchInp = document.getElementById("order-search");
if (orderSearchInp) {
  orderSearchInp.addEventListener("input", (e) => {
    orderSearchTerm = e.target.value.trim().toLowerCase();
    renderOrders();
  });
}

function renderOrders() {
  let list = [...DB.orders].sort((a, b) => (b.date + b.invoice).localeCompare(a.date + a.invoice));
  
  document.getElementById("ord-met-total").textContent = DB.orders.length;
  document.getElementById("ord-met-delivered").textContent = DB.orders.filter(o => o.status === "delivered").length;
  document.getElementById("ord-met-pending").textContent = DB.orders.filter(o => o.status === "pending" || o.status === "shipped").length;
  document.getElementById("ord-met-returned").textContent = DB.orders.filter(o => o.status === "returned" || o.status === "cancelled").length;

  if (orderStatusFilter !== "all") list = list.filter(o => o.status === orderStatusFilter);
  if (orderSearchTerm) {
    list = list.filter(o =>
      o.name.toLowerCase().includes(orderSearchTerm) ||
      (o.phone || "").includes(orderSearchTerm) ||
      (o.invoice || "").toLowerCase().includes(orderSearchTerm) ||
      (o.tracking || "").toLowerCase().includes(orderSearchTerm)
    );
  }

  document.getElementById("order-count").textContent = list.length + " Orders";
  const tbody = document.getElementById("order-table-body");
  if (!tbody) return;

  tbody.innerHTML = list.length ? list.map(o => {
    const isChecked = selectedOrderIds.has(o.id) ? "checked" : "";
    const itemsListHtml = o.items && o.items.length 
      ? o.items.map(it => `<span style="display:inline-block; background:var(--surface-2); padding:2px 5px; border-radius:4px; margin:1px; font-size:11px"><b>${it.name}</b> × ${it.qty}</span>`).join(" ")
      : "<span class='muted'>—</span>";

    return `
      <tr>
        <td><input type="checkbox" class="chk-order-row" data-id="${o.id}" ${isChecked} onchange="toggleOrderSelection(${o.id}, this.checked)"></td>
        <td><b>${o.invoice}</b><br><span class="mono muted" style="font-size:10.5px">${o.date}</span></td>
        <td>
          <b>${o.name}</b><br>
          <span class="muted mono" style="font-size:11px">${o.phone}</span>
        </td>
        <td style="max-width:220px; line-height:1.4">
          ${itemsListHtml}
        </td>
        <td class="mono">
          <a href="${getCourierLiveTrackingLink(o.courier, o.tracking)}" target="_blank" style="text-decoration:none; color:var(--purple); font-weight:700">
            ${o.tracking || 'No Track'} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:9px"></i>
          </a>
        </td>
        <td>${o.courier}</td>
        <td class="num mono"><b>${money(o.grandTotal)}</b></td>
        <td class="num mono text-amber-600">${money(o.totalCOGS)}</td>
        <td>
          <select onchange="quickStatus(${o.id}, this.value)" style="border:1px solid var(--line);border-radius:6px;padding:3px;font-size:11px">
            ${["pending", "shipped", "delivered", "returned", "cancelled"].map(s => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </td>
        <td style="text-align:center">
          <button class="btn ghost sm" onclick="editOrder(${o.id})" title="Edit Order Details">Edit</button>
          <button class="btn whatsapp sm" onclick="sendWhatsAppOrderAlert(${o.id})" title="Send WhatsApp Confirmation"><i class="fa-brands fa-whatsapp"></i></button>
          <button class="btn ghost sm" onclick="openSinglePrintModal(${o.id})" title="Print Invoice / Sticker">🖨️</button>
          <button class="btn danger sm" onclick="deleteOrder(${o.id})">✕</button>
        </td>
      </tr>`;
  }).join("") : `<tr><td colspan="11" class="tbl-empty">No orders found</td></tr>`;
}

function deleteOrder(id) {
  const currentUser = getActiveUser();
  if (currentUser && currentUser.permissions && !currentUser.permissions.orderEdit) {
    toast("আপনার অর্ডার মুছে ফেলার পারমিশন নেই ❌"); return;
  }
  if (!confirm("অর্ডার মুছে ফেলবেন?")) return;
  const o = DB.orders.find(x => x.id === id);
  if (o && o.stockDeducted) revertAutomaticDeductions(o);
  DB.orders = DB.orders.filter(o => o.id !== id);
  selectedOrderIds.delete(id);
  saveDB();
  logActivity("Orders", `Deleted order: ${o ? o.invoice : id}`);
  renderOrders();
}

function openSinglePrintModal(id) {
  selectedOrderIds.clear();
  selectedOrderIds.add(id);
  bulkPrint('invoice');
}

function handleOrderCSVImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== "");
    if (lines.length <= 1) { toast("CSV ফাইলে ডাটা নেই"); return; }

    let importedCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map(v => v.replace(/^"|"$/g, '').trim());
      if (vals.length < 3) continue;
      
      const importedOrder = {
        id: Date.now() + i,
        invoice: vals[0] || nextInvoice(),
        date: vals[1] || todayStr(),
        name: vals[2] || "Customer",
        phone: vals[3] || "",
        courier: vals[4] || "Steadfast",
        tracking: vals[5] || "",
        status: (vals[6] || "delivered").toLowerCase(),
        items: [{ productId: 1, name: "Imported Product", qty: 1, price: Number(vals[7]) || 1200, cost: Number(vals[8]) || 800 }],
        packagingId: 0, packagingCost: 0,
        subtotal: Number(vals[7]) || 1200, delivery: 0, advance: 0, discount: 0,
        grandTotal: Number(vals[7]) || 1200, totalCOGS: Number(vals[8]) || 800, due: 0,
        stockDeducted: false
      };

      if (importedOrder.status === "delivered") applyAutomaticDeductions(importedOrder);
      DB.orders.push(importedOrder);
      importedCount++;
    }

    saveDB();
    logActivity("CSV Import", `Imported ${importedCount} orders`);
    renderAll();
    toast(`সফলভাবে ${importedCount} টি অর্ডার ইমপোর্ট হয়েছে`);
  };
  reader.readAsText(file);
  event.target.value = "";
}

/* =======================================================================
   ACCOUNTING & PURCHASE HISTORY
======================================================================= */
document.querySelectorAll("#acc-tabs .tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll("#acc-tabs .tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    const sub = t.dataset.sub;
    document.querySelectorAll(".acc-sub-view").forEach(v => v.style.display = "none");
    document.getElementById("acc-sub-" + sub).style.display = "block";
    renderAccounting();
  });
});

function openPurchaseModal() {
  document.getElementById("purchase-modal-title").textContent = "Record Stock Purchase & New Batch (FIFO)";
  document.getElementById("f-purch-date").value = todayStr();
  const pSel = document.getElementById("f-purch-product");
  pSel.innerHTML = DB.products.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  document.getElementById("f-purch-qty").value = 10;
  document.getElementById("f-purch-batch").value = `LOT-${Math.floor(1000 + Math.random() * 9000)}`;
  document.getElementById("f-purch-expiry").value = "";
  document.getElementById("f-purch-supplier").value = "";
  document.getElementById("f-purch-note").value = "";
  syncPurchaseDefaults();
  openModal("modal-purchase");
}

const purchProductSelect = document.getElementById("f-purch-product");
if (purchProductSelect) purchProductSelect.addEventListener("change", syncPurchaseDefaults);

function syncPurchaseDefaults() {
  const pid = Number(document.getElementById("f-purch-product").value);
  const p = DB.products.find(x => x.id === pid);
  if (p) {
    document.getElementById("f-purch-cost").value = getFIFOCost(p, 1);
    document.getElementById("f-purch-price").value = p.sellPrice;
    calculatePurchaseTotal();
  }
}

function calculatePurchaseTotal() {
  const qty = Number(document.getElementById("f-purch-qty").value) || 0;
  const cost = Number(document.getElementById("f-purch-cost").value) || 0;
  document.getElementById("f-purch-total").value = qty * cost;
}

document.getElementById("btn-save-purchase").addEventListener("click", () => {
  const pid = Number(document.getElementById("f-purch-product").value);
  const p = DB.products.find(x => x.id === pid);
  if (!p) return;

  const date = document.getElementById("f-purch-date").value || todayStr();
  const qty = Number(document.getElementById("f-purch-qty").value) || 1;
  const cost = Number(document.getElementById("f-purch-cost").value) || 0;
  const price = Number(document.getElementById("f-purch-price").value) || p.sellPrice;
  const batchNo = document.getElementById("f-purch-batch").value.trim() || `LOT-${Date.now().toString().slice(-4)}`;
  const expiryDate = document.getElementById("f-purch-expiry").value;
  const supplier = document.getElementById("f-purch-supplier").value.trim() || "Wholesale";
  const total = qty * cost;

  p.batches = p.batches || [];
  p.batches.push({ batchNo, qty, cost, expiryDate });
  p.stock += qty;
  p.sellPrice = price;

  DB.purchases.push({ id: Date.now(), date, productName: p.name, batchNo, qty, cost, total, supplier });
  logActivity("Purchase Entry", `Recorded purchase & new batch: ${p.name} (${qty} pcs)`);
  saveDB(); closeModal("modal-purchase"); renderAccounting(); renderProducts(); toast("Purchase & Batch সেভ হয়েছে");
});

function openExpenseModal(defaultCat) {
  document.getElementById("f-exp-date").value = todayStr();
  document.getElementById("f-exp-cat").value = defaultCat || "General Expense";
  document.getElementById("f-exp-title").value = "";
  document.getElementById("f-exp-amount").value = "";
  openModal("modal-expense");
}

document.getElementById("btn-save-expense").addEventListener("click", () => {
  const amount = Number(document.getElementById("f-exp-amount").value) || 0;
  const title = document.getElementById("f-exp-title").value.trim();
  if (!title || amount <= 0) return;

  DB.expenses.push({
    id: Date.now(),
    date: document.getElementById("f-exp-date").value || todayStr(),
    cat: document.getElementById("f-exp-cat").value,
    title, amount
  });

  logActivity("Expense", `Added expense: ${title} (৳${amount})`);
  saveDB(); closeModal("modal-expense"); renderAccounting(); toast("খরচ সংরক্ষণ করা হয়েছে");
});

function deleteExpense(id) {
  DB.expenses = DB.expenses.filter(e => e.id !== id);
  saveDB(); renderAccounting();
}

function saveMetaSpend() {
  const usd = Number(document.getElementById("meta-usd").value) || 0;
  const rate = Number(document.getElementById("meta-rate").value) || 130;
  const date = document.getElementById("meta-date").value || todayStr();
  if (usd <= 0) return;
  const bdt = usd * rate;

  DB.expenses.push({ id: Date.now(), date, cat: "মার্কেটিং / Ads", title: `Meta Ads Spend ($${usd} @ ৳${rate})`, amount: bdt });
  logActivity("Meta Ads", `Synced Meta spend: $${usd} = ৳${bdt}`);
  saveDB(); document.getElementById("meta-usd").value = "";
  renderAccounting(); toast(`৳${bdt} টাকার Ads খরচ সেভ হয়েছে`);
}

function renderAccounting() {
  const delivered = DB.orders.filter(o => o.status === "delivered");
  const totInc = delivered.reduce((s, o) => s + o.grandTotal, 0);
  const totExp = DB.expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totPurch = DB.purchases.reduce((s, p) => s + Number(p.total || 0), 0);
  const netCash = totInc - totExp;

  document.getElementById("acc-tot-inc").textContent = money(totInc);
  document.getElementById("acc-tot-exp").textContent = money(totExp);
  document.getElementById("acc-tot-purch").textContent = money(totPurch);
  document.getElementById("acc-tot-bal").textContent = money(netCash);

  const tBody = document.getElementById("acc-trans-body");
  const expSorted = [...DB.expenses].sort((a, b) => b.date.localeCompare(a.date));
  if (tBody) {
    tBody.innerHTML = expSorted.length ? expSorted.map(e => `
      <tr>
        <td class="mono">${e.date}</td>
        <td><span class="badge b-pending">${e.cat}</span></td>
        <td><b>${e.title}</b></td>
        <td class="num mono neg">-${money(e.amount)}</td>
        <td><button class="btn danger sm" onclick="deleteExpense(${e.id})">✕</button></td>
      </tr>
    `).join("") : `<tr><td colspan="5" class="tbl-empty">No expenses</td></tr>`;
  }

  const purchBody = document.getElementById("acc-purchases-body");
  const purchSorted = [...DB.purchases].sort((a, b) => b.date.localeCompare(a.date));
  if (purchBody) {
    purchBody.innerHTML = purchSorted.length ? purchSorted.map(p => `
      <tr>
        <td class="mono">${p.date}</td>
        <td><b>${p.productName}</b></td>
        <td class="mono"><b>${p.batchNo || 'Main'}</b></td>
        <td class="num mono">${p.qty}</td>
        <td class="num mono text-amber-600">${money(p.cost)}</td>
        <td class="num mono text-blue-600"><b>${money(p.total)}</b></td>
        <td>${p.supplier || "—"}</td>
        <td style="text-align:center"><button class="btn danger sm" onclick="deletePurchase(${p.id})">✕</button></td>
      </tr>
    `).join("") : `<tr><td colspan="8" class="tbl-empty">No purchases</td></tr>`;
  }

  const cMap = { Steadfast: 0, Pathao: 0, Redx: 0, Carrybee: 0 };
  const cLoss = { Steadfast: 0, Pathao: 0, Redx: 0, Carrybee: 0 };
  const cCount = { Steadfast: 0, Pathao: 0, Redx: 0, Carrybee: 0 };

  DB.orders.forEach(o => {
    const c = o.courier || "Steadfast";
    if (cCount[c] !== undefined) cCount[c]++;
    if (o.status === "delivered" && cMap[c] !== undefined) cMap[c] += o.grandTotal;
    if (o.status === "returned" && cLoss[c] !== undefined) cLoss[c] += Number(o.delivery || 0);
  });

  if (document.getElementById("courier-val-steadfast")) {
    document.getElementById("courier-val-steadfast").textContent = money(cMap.Steadfast);
    document.getElementById("courier-val-pathao").textContent = money(cMap.Pathao);
    document.getElementById("courier-val-redx").textContent = money(cMap.Redx);
    document.getElementById("courier-val-carrybee").textContent = money(cMap.Carrybee);
  }

  const cBody = document.getElementById("acc-courier-body");
  if (cBody) {
    cBody.innerHTML = Object.keys(cMap).map(c => `
      <tr>
        <td><b>${c}</b></td>
        <td class="num mono">${cCount[c]}</td>
        <td class="num mono pos">${money(cMap[c])}</td>
        <td class="num mono neg">-${money(cLoss[c])}</td>
      </tr>
    `).join("");
  }

  const staffExp = DB.expenses.filter(e => e.cat.includes("Staff") || e.cat.includes("বেতন"));
  const staffBody = document.getElementById("acc-staff-body");
  if (staffBody) {
    staffBody.innerHTML = staffExp.length ? staffExp.map(e => `
      <tr><td class="mono">${e.date}</td><td>${e.title}</td><td class="num mono neg">-${money(e.amount)}</td><td><button class="btn danger sm" onclick="deleteExpense(${e.id})">✕</button></td></tr>
    `).join("") : `<tr><td colspan="4" class="tbl-empty">No records</td></tr>`;
  }

  const offExp = DB.expenses.filter(e => e.cat.includes("Office"));
  const offBody = document.getElementById("acc-office-body");
  if (offBody) {
    offBody.innerHTML = offExp.length ? offExp.map(e => `
      <tr><td class="mono">${e.date}</td><td>${e.cat}</td><td>${e.title}</td><td class="num mono neg">-${money(e.amount)}</td><td><button class="btn danger sm" onclick="deleteExpense(${e.id})">✕</button></td></tr>
    `).join("") : `<tr><td colspan="5" class="tbl-empty">No records</td></tr>`;
  }
}

function deletePurchase(id) {
  DB.purchases = DB.purchases.filter(x => x.id !== id);
  saveDB(); renderAccounting();
}

/* =======================================================================
   REPORTS ENGINE
======================================================================= */
document.querySelectorAll(".rep-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".rep-tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentReportTab = btn.dataset.target;
    document.querySelectorAll(".rep-view-content").forEach(v => v.style.display = "none");
    document.getElementById("rep-view-" + currentReportTab).style.display = "block";
    renderReports();
  });
});

document.querySelectorAll("#rep-period-pills button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#rep-period-pills button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    reportPeriod = btn.dataset.p;
    renderReports();
  });
});

function renderReports() {
  const { orders, expenses } = getPeriodFilteredData(reportPeriod);
  const delivered = orders.filter(o => o.status === "delivered");
  const returned = orders.filter(o => o.status === "returned");

  const revenue = delivered.reduce((s, o) => s + o.grandTotal, 0);
  const cogs = delivered.reduce((s, o) => s + o.totalCOGS, 0);
  const genExp = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const returnLoss = returned.reduce((s, o) => s + Number(o.delivery || 0), 0);
  const totalExp = genExp + returnLoss;
  const netProfit = revenue - cogs - totalExp;

  document.getElementById("rep-p-sales").textContent = money(revenue);
  document.getElementById("rep-p-cogs").textContent = money(cogs);
  document.getElementById("rep-p-expenses").textContent = money(totalExp);
  document.getElementById("rep-p-orders-count").textContent = `${orders.length} Orders (${delivered.length} Delivered)`;
  document.getElementById("rep-p-profit").textContent = money(netProfit);
  
  const marginPct = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0;
  document.getElementById("rep-p-margin").textContent = `▲ ${marginPct}% Margin`;

  const pProfit = revenue > 0 ? Math.max(0, Math.round((netProfit / revenue) * 100)) : 0;
  const pCogs = revenue > 0 ? Math.min(100, Math.round((cogs / revenue) * 100)) : 0;
  const pExp = revenue > 0 ? Math.min(100, Math.round((totalExp / revenue) * 100)) : 0;

  document.getElementById("bar-profit-pct").textContent = pProfit + "%";
  document.getElementById("bar-profit-val").textContent = money(netProfit);
  document.getElementById("bar-cogs-pct").textContent = pCogs + "%";
  document.getElementById("bar-cogs-val").textContent = money(cogs);
  document.getElementById("bar-exp-pct").textContent = pExp + "%";
  document.getElementById("bar-exp-val").textContent = money(totalExp);

  document.getElementById("fill-profit").style.width = pProfit + "%";
  document.getElementById("fill-cogs").style.width = pCogs + "%";
  document.getElementById("fill-exp").style.width = pExp + "%";

  const breakdownTbody = document.getElementById("rep-detailed-breakdown");
  if (breakdownTbody) {
    breakdownTbody.innerHTML = `
      <tr><td><b>Revenue (মোট বিক্রয়)</b></td><td class="num pos">+${money(revenue)}</td><td class="num">100%</td></tr>
      <tr><td><b>Product Cost (FIFO COGS)</b></td><td class="num neg">-${money(cogs)}</td><td class="num">${pCogs}%</td></tr>
      <tr><td><b>লজিস্টিক ও অন্যান্য খরচ</b></td><td class="num neg">-${money(totalExp)}</td><td class="num">${pExp}%</td></tr>
      <tr style="font-weight:800; background:var(--surface-2)"><td>নিট মুনাফা (NET PROFIT)</td><td class="num ${netProfit >= 0 ? 'pos' : 'neg'}">${money(netProfit)}</td><td class="num">${marginPct}%</td></tr>
    `;
  }

  renderProductReport();
  renderPackagingReport(orders);
}

function renderProductReport() {
  const { orders } = getPeriodFilteredData(reportPeriod);
  const pMap = {};
  orders.forEach(o => {
    if (o.items) {
      o.items.forEach(it => {
        if (!pMap[it.name]) pMap[it.name] = { name: it.name, orders: 0, qty: 0, deliveredQty: 0, returnedQty: 0, revenue: 0, cogs: 0 };
        pMap[it.name].orders++;
        pMap[it.name].qty += it.qty;
        if (o.status === "delivered") {
          pMap[it.name].deliveredQty += it.qty;
          pMap[it.name].revenue += (it.price * it.qty);
          pMap[it.name].cogs += (it.cost * it.qty);
        }
        if (o.status === "returned") pMap[it.name].returnedQty += it.qty;
      });
    }
  });

  const tbody = document.getElementById("rep-product-table-body");
  if (tbody) {
    tbody.innerHTML = Object.values(pMap).map(p => `
      <tr>
        <td><b>${p.name}</b></td>
        <td class="num mono">${p.orders}</td>
        <td class="num mono">${p.qty}</td>
        <td class="num mono pos">${p.deliveredQty}</td>
        <td class="num mono neg">${p.returnedQty}</td>
        <td class="num mono"><b>${money(p.revenue)}</b></td>
        <td class="num mono">${p.qty > 0 ? Math.round((p.deliveredQty / p.qty) * 100) : 0}%</td>
        <td class="num mono pos">${money(p.revenue - p.cogs)}</td>
      </tr>
    `).join("");
  }
}

function renderPackagingReport(orders) {
  const delivered = orders.filter(o => o.status === "delivered");
  const usedUnits = delivered.reduce((s, o) => s + (o.packagingId ? 1 : 0), 0);
  const usedCost = delivered.reduce((s, o) => s + (o.packagingCost || 0), 0);
  const totalStockVal = DB.packaging.reduce((s, pk) => s + (pk.cost * pk.stock), 0);

  if (document.getElementById("pack-rep-used-units")) {
    document.getElementById("pack-rep-used-units").textContent = `${usedUnits} pcs`;
    document.getElementById("pack-rep-used-cost").textContent = money(usedCost);
    document.getElementById("pack-rep-inventory-val").textContent = money(totalStockVal);
  }

  const tbody = document.getElementById("rep-packaging-table-body");
  if (tbody) {
    tbody.innerHTML = DB.packaging.map(pk => `
      <tr>
        <td><b>${pk.name}</b></td>
        <td class="num mono">${pk.stock}</td>
        <td class="num mono">৳${pk.cost}</td>
        <td class="num mono"><b>৳${pk.cost * pk.stock}</b></td>
      </tr>
    `).join("");
  }
}

function exportProfitCSV() {
  const { orders, expenses } = getPeriodFilteredData(reportPeriod);
  const rev = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.grandTotal, 0);
  downloadCSV(`Revenue,${rev}\nExpenses,${expenses.reduce((s, e) => s + Number(e.amount || 0), 0)}\n`, "Profit_Report.csv");
}
function exportProductCSV() {
  let csv = "Product,Orders\n";
  DB.products.forEach(p => csv += `"${p.name}",${p.stock}\n`);
  downloadCSV(csv, "Products_Report.csv");
}
function exportCourierCSV() {
  let csv = "Invoice,Courier,Status,Amount\n";
  DB.orders.forEach(o => csv += `"${o.invoice}","${o.courier}","${o.status}",${o.grandTotal}\n`);
  downloadCSV(csv, "Courier_Report.csv");
}
function exportOrdersToCSV() {
  let csv = "Invoice,Date,Customer,Phone,Courier,Tracking,Status,Total\n";
  DB.orders.forEach(o => csv += `"${o.invoice}","${o.date}","${o.name}","${o.phone}","${o.courier}","${o.tracking || ''}","${o.status}",${o.grandTotal}\n`);
  downloadCSV(csv, `orders-${todayStr()}.csv`);
}
function downloadCSV(content, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8;" }));
  a.download = filename;
  a.click();
}

/* =======================================================================
   CUSTOMERS & FRAUD PROTECTION
======================================================================= */
if (document.getElementById("btn-new-blacklist")) {
  document.getElementById("btn-new-blacklist").addEventListener("click", () => {
    document.getElementById("f-black-phone").value = "";
    document.getElementById("f-black-reason").value = "";
    openModal("modal-blacklist");
  });
}

document.getElementById("btn-save-blacklist").addEventListener("click", () => {
  const phone = document.getElementById("f-black-phone").value.trim();
  const reason = document.getElementById("f-black-reason").value.trim();
  if (!phone) return;
  DB.blacklist.push({ id: Date.now(), phone, reason, date: todayStr() });
  logActivity("Blacklist", `Blacklisted number: ${phone}`);
  saveDB(); closeModal("modal-blacklist"); renderCustomers(); toast("নম্বর ব্ল্যাকলিস্টে যুক্ত হয়েছে");
});

function deleteBlacklist(id) {
  DB.blacklist = DB.blacklist.filter(x => x.id !== id);
  saveDB(); renderCustomers();
}

function renderCustomers() {
  const map = {};
  DB.orders.forEach(o => {
    if (!map[o.phone]) map[o.phone] = { name: o.name, phone: o.phone, total: 0, delivered: 0, returned: 0, spent: 0 };
    map[o.phone].total++;
    if (o.status === "delivered") {
      map[o.phone].delivered++;
      map[o.phone].spent += o.grandTotal;
    } else if (o.status === "returned" || o.status === "cancelled") {
      map[o.phone].returned++;
    }
  });

  const list = Object.values(map).sort((a, b) => b.spent - a.spent);
  document.getElementById("cust-stat-total").textContent = list.length;
  document.getElementById("cust-stat-spent").textContent = money(list.reduce((s, c) => s + c.spent, 0));
  document.getElementById("cust-stat-blocked").textContent = DB.blacklist.length;

  const tbody = document.getElementById("customer-table-body");
  if (tbody) {
    tbody.innerHTML = list.length ? list.map(c => {
      const returnRatio = c.total > 0 ? ((c.returned / c.total) * 100).toFixed(0) : 0;
      let riskBadge = `<span class="badge b-risk-safe">Safe (0%)</span>`;
      if (returnRatio >= 50) riskBadge = `<span class="badge b-risk-high">High Risk (${returnRatio}%)</span>`;
      else if (returnRatio > 0) riskBadge = `<span class="badge b-risk-medium">Medium (${returnRatio}%)</span>`;

      return `
        <tr>
          <td><b>${c.name}</b></td>
          <td class="mono muted">${c.phone}</td>
          <td class="num mono">${c.total}</td>
          <td class="num mono pos">${c.delivered}</td>
          <td class="num mono neg">${c.returned}</td>
          <td>${riskBadge}</td>
          <td class="num mono"><b>${money(c.spent)}</b></td>
        </tr>`;
    }).join("") : `<tr><td colspan="7" class="tbl-empty">No customers</td></tr>`;
  }

  const bTbody = document.getElementById("blacklist-table-body");
  if (bTbody) {
    bTbody.innerHTML = DB.blacklist.length ? DB.blacklist.map(b => `
      <tr>
        <td class="mono"><b>${b.phone}</b></td>
        <td>${b.reason || "—"}</td>
        <td class="mono muted">${b.date}</td>
        <td><button class="btn danger sm" onclick="deleteBlacklist(${b.id})">Unblock</button></td>
      </tr>
    `).join("") : `<tr><td colspan="4" class="tbl-empty">No blacklisted numbers</td></tr>`;
  }
}

/* =======================================================================
   SETTINGS & BACKUP CONTROLLER
======================================================================= */
function renderSettings() {
  document.getElementById("set-branding-name").value = DB.settings.appName || "SKM Flow";
  document.getElementById("set-branding-sub").value = DB.settings.appSub || "Enterprise Business Suite";
  document.getElementById("set-shopname").value = DB.settings.shopName;
  document.getElementById("set-phone").value = DB.settings.phone;
  document.getElementById("set-address").value = DB.settings.address;
  document.getElementById("set-currency").value = DB.settings.currency;

  const rules = DB.settings.shippingRules || { insideDhaka: 80, outsideDhaka: 130, perKgCharge: 20 };
  document.getElementById("rule-dhaka").value = rules.insideDhaka;
  document.getElementById("rule-outside").value = rules.outsideDhaka;
  document.getElementById("rule-weight").value = rules.perKgCharge;

  const api = DB.settings.courierApiKeys || {};
  document.getElementById("set-steadfast-key").value = api.steadfast || "";
  document.getElementById("set-pathao-key").value = api.pathao || "";

  const fraudApi = DB.settings.fraudCheckerApi || {};
  document.getElementById("set-fraud-api-key").value = fraudApi.apiKey || "rlPhB2yDqwi1EOJQ4z42GwdfAVyEBTXqt65lUFz1nYjAdWAQr5n80YwwBCT4";
  document.getElementById("set-fraud-api-url").value = fraudApi.apiUrl || "https://api.bdcourier.com/courier-check";
}

document.getElementById("btn-export").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(DB, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `skm-backup-${todayStr()}.json`;
  a.click();
  logActivity("Backup", "Exported system JSON backup");
});

document.getElementById("btn-import-trigger").addEventListener("click", () => document.getElementById("file-import").click());

document.getElementById("file-import").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      DB = JSON.parse(ev.target.result);
      saveDB(); applyTheme(); applyBranding(); renderAll();
      logActivity("Backup", "Restored system database from JSON backup");
      toast("Backup Imported Successfully");
    } catch (err) { toast("Invalid JSON file"); }
  };
  reader.readAsText(file);
});

document.getElementById("btn-reset-all").addEventListener("click", () => {
  if (confirm("Reset all data? This cannot be undone.")) {
    localStorage.removeItem(DB_KEY);
    DB = defaultDB(); applyTheme(); applyBranding(); renderAll();
    saveDB();
    toast("All data reset");
  }
});

/* =======================================================================
   SYSTEM BOOTSTRAP INITIALIZER
======================================================================= */
function renderAll() {
  renderDashboard();
  renderOrders();
  renderCourierManagement();
  renderWholesale();
  renderProducts();
  renderPackaging();
  renderAccounting();
  renderCustomers();
  renderUsers();
  renderReports();
  renderActivityLogs();
  renderSettings();
  updateNotificationCenter();
}

window.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  applyBranding();
  checkAuthSession();
  syncFromBackend();
  renderAll();
});

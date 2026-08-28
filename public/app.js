/* =======================================================================
   SKM FLOW — ULTIMATE ENTERPRISE ERP ENGINE (FULL FEATURE MATRIX)
======================================================================= */

const DB_KEY = "skm_flow_complete_v16";
const BACKEND_API_ENDPOINT = "/api/data";
const SESSION_KEY = "erp_active_user_session";
const CSV_SECURITY_PASS = "159357";

function todayStr() { return new Date().toISOString().slice(0, 10); }

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

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
        id: 1, name: "COSRX Snail 96 Mucin", sku: "COS-01", sellPrice: 1550, stock: 45, alertLimit: 20, image: "",
        batches: [
          { batchNo: "BATCH-2026-A", qty: 25, cost: 1120, expiryDate: "2027-08-15" },
          { batchNo: "BATCH-2026-B", qty: 20, cost: 1150, expiryDate: "2027-11-20" }
        ],
        costHistory: [{ cost: 1150, date: todayStr() }]
      },
      {
        id: 2, name: "Beauty of Joseon Sunscreen", sku: "BOJ-02", sellPrice: 1200, stock: 10, alertLimit: 15, image: "",
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
      { id: 501, invoice: "WS-5001", date: todayStr(), clientName: "Chawkbazar Wholesaler", phone: "01811111111", address: "Dhaka", courier: "Sundarban", tracking: "SB-8910", courierCost: 200, packagingCost: 50, items: [{ productId: 1, name: "COSRX Snail 96 Mucin", qty: 10, price: 1350, cost: 1120 }], bill: 13500, paid: 10000, due: 3500, totalCost: 11450, profit: 2050, status: "pending", stockDeducted: true }
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
let reportPeriod = "today";
let currentReportTab = "profit-report";
let dashPeriod = "today";

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
      if (serverData && serverData.products && serverData.products.length > 0) {
        DB = serverData;
        localStorage.setItem(DB_KEY, JSON.stringify(DB));
        renderAll();
      } else {
        saveDB();
      }
    }
  } catch (e) {
    console.error("Backend sync failed, using local database:", e);
  }
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

function getPeriodFilteredData(period, isReports = false) {
  const today = todayStr();
  const yest = yesterdayStr();
  let ordList = DB.orders;
  let expList = DB.expenses;

  if (period === "today") {
    ordList = DB.orders.filter(o => o.date === today);
    expList = DB.expenses.filter(e => e.date === today);
  } else if (period === "yesterday") {
    ordList = DB.orders.filter(o => o.date === yest);
    expList = DB.expenses.filter(e => e.date === yest);
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
    const startInp = isReports ? document.getElementById("rep-start-date") : document.getElementById("dash-start-date");
    const endInp = isReports ? document.getElementById("rep-end-date") : document.getElementById("dash-end-date");
    const start = startInp ? startInp.value : "";
    const end = endInp ? endInp.value : "";
    if (start && end) {
      ordList = DB.orders.filter(o => o.date >= start && o.date <= end);
      expList = DB.expenses.filter(e => e.date >= start && e.date <= end);
    }
  } else if (period === "all") {
    ordList = DB.orders;
    expList = DB.expenses;
  }
  return { orders: ordList, expenses: expList };
}

function openImagePreview(imgSrc, title) {
  if (!imgSrc) return;
  document.getElementById("preview-modal-img").src = imgSrc;
  document.getElementById("image-preview-title").textContent = title || "প্রোডাক্ট প্রিভিউ";
  openModal("modal-image-preview");
}

function closeImagePreview() {
  closeModal("modal-image-preview");
  document.getElementById("preview-modal-img").src = "";
}

function openOrderPreview(orderId, isWholesale = false) {
  const item = isWholesale ? DB.wholesale.find(x => x.id === orderId) : DB.orders.find(x => x.id === orderId);
  if (!item) return;

  const titleEl = document.getElementById("preview-modal-invoice-title");
  const contentEl = document.getElementById("order-preview-content");

  titleEl.textContent = `Preview: ${item.invoice} (${isWholesale ? item.clientName : item.name})`;

  let itemsHtml = item.items ? item.items.map(i => `<li><b>${i.name}</b> — Qty: ${i.qty} | Rate: ${money(i.price || i.rate || 0)}</li>`).join("") : "<li>কোনো পণ্য নেই</li>";

  contentEl.innerHTML = `
    <p><b>তারিখ:</b> ${item.date}</p>
    <p><b>গ্রাহক নাম:</b> ${isWholesale ? item.clientName : item.name}</p>
    <p><b>ফোন:</b> ${item.phone}</p>
    <p><b>ঠিকানা:</b> ${item.address || "প্রযোজ্য নয়"}</p>
    <p><b>কুরিয়ার:</b> ${item.courier} (Tracking: ${item.tracking || 'N/A'})</p>
    <hr style="border:0; border-top:1px solid var(--line); margin: 8px 0;">
    <p><b>অর্ডারকৃত পণ্যসমূহ (প্যাকেজিং টিমের জন্য):</b></p>
    <ul style="padding-left: 18px; margin: 4px 0;">${itemsHtml}</ul>
    <hr style="border:0; border-top:1px solid var(--line); margin: 8px 0;">
    <p><b>সর্বমোট বিল:</b> ${money(isWholesale ? item.bill : item.grandTotal)}</p>
    <p><b>স্ট্যাটাস:</b> <span class="badge b-${item.status}">${item.status}</span></p>
  `;

  openModal("modal-order-preview");
}

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

async function fetchLiveFraudDataFromAPI(phone) {
  const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
  const hardcodedKey = "rlPhB2yDqwi1EOJQ4z42GwdfAVyEBTXqt65lUFz1nYjAdWAQr5n80YwwBCT4";
  const savedKey = (DB.settings && DB.settings.fraudCheckerApi && DB.settings.fraudCheckerApi.apiKey) ? DB.settings.fraudCheckerApi.apiKey.trim() : hardcodedKey;
  try {
    const response = await fetch("/api/check-fraud-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleanPhone, apiKey: savedKey })
    });
    if (response.ok) {
      const resJson = await response.json();
      const root = resJson.data || resJson.result || resJson;
      return { total: Number(root.total || 0), success: Number(root.success || 0), cancel: Number(root.cancel || 0), couriers: [], isSuccess: true };
    }
  } catch (e) {}
  return { total: 0, success: 0, cancel: 0, couriers: [], isSuccess: false };
}

function formatAndValidateFraudPhone(input) {
  let val = input.value || "";
  let digits = val.replace(/[^0-9]/g, '');
  if (digits.length > 11) digits = digits.slice(0, 11);
  input.value = digits;
}

async function runManualFraudCheck() {
  const phone = document.getElementById("fraud-search-phone").value.trim();
  if (!phone || phone.length !== 11) { toast("সম্পূর্ণ ১১ ডিজিটের নম্বর দিন"); return; }
  const data = await fetchLiveFraudDataFromAPI(phone);
  toast(data.isSuccess ? `ফলাফল পাওয়া গেছে: মোট অর্ডার ${data.total}` : "কোনো ডাটা পাওয়া যায়নি");
}

function checkOrderPhoneFraudAPI() {
  const phone = document.getElementById("f-order-phone").value.trim();
  if (phone.length === 11) evaluateCustomerRisk(phone);
}

function evaluateCustomerRisk(phone) {
  const cleanPhone = phone.trim();
  const alertBox = document.getElementById("customer-risk-indicator");
  if (!cleanPhone || cleanPhone.length < 11) { alertBox.style.display = "none"; return; }
  alertBox.style.display = "block";
  alertBox.style.background = "var(--green-soft)";
  alertBox.style.color = "var(--green)";
  alertBox.innerHTML = `🟢 Checked: Safe Customer`;
}

function getCourierLiveTrackingLink(courier, tracking) {
  if (!tracking) return "#";
  const tr = encodeURIComponent(tracking.trim());
  if (courier === "Steadfast") return `https://steadfast.com.bd/t/${tr}`;
  if (courier === "Pathao") return `https://merchant.pathao.com/tracking?consignment_id=${tr}`;
  if (courier === "Redx") return `https://redx.com.bd/track?trackingId=${tr}`;
  if (courier === "Carrybee") return `https://carrybee.com/track/${tr}`;
  return `https://www.google.com/search?q=${courier}+tracking+${tr}`;
}

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

function setPrintMode(mode) { bulkPrint(mode); }

function bulkPrint(mode) {
  const ids = Array.from(selectedOrderIds);
  if (!ids.length) { toast("অন্তত ১টি অর্ডার সিলেক্ট করুন"); return; }
  const orders = DB.orders.filter(o => ids.includes(o.id));
  const container = document.getElementById("printable-area");
  container.innerHTML = orders.map(o => `<div class="invoice-print-sheet"><h3>${o.invoice}</h3><p>${o.name} - ${o.phone}</p></div>`).join("");
  openModal("modal-print");
}

/* =======================================================================
   AUTH & SESSIONS
======================================================================= */
function getActiveUser() {
  const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
  if (raw) { try { return JSON.parse(raw); } catch (e) { return null; } }
  return null;
}

function checkAuthSession() {
  const currentUser = getActiveUser();
  const overlay = document.getElementById("auth-overlay");
  if (!currentUser) { if (overlay) overlay.style.display = "flex"; }
  else {
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
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(found));
    localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    checkAuthSession(); renderAll(); toast(`স্বাগতম, ${found.name}`);
  } else { alert("ভুল ইউজারনেম অথবা পাসওয়ার্ড!"); }
}

function logoutUser() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  checkAuthSession(); toast("লগআউট সম্পন্ন");
}

function enforceRoleAccessPermissions() {
  const user = getActiveUser();
  if (!user) return;
  const perms = user.permissions || {};
  const isAdmin = user.role === "Admin" || user.name === "Super Admin";

  document.querySelectorAll("[data-perm='accounting']").forEach(el => el.style.display = perms.accountingAccess || isAdmin ? "flex" : "none");
  document.querySelectorAll("[data-perm='users']").forEach(el => el.style.display = isAdmin ? "flex" : "none");
  document.querySelectorAll("[data-perm='wholesale']").forEach(el => el.style.display = isAdmin ? "flex" : "none");
  document.querySelectorAll("[data-perm='reports']").forEach(el => el.style.display = isAdmin ? "flex" : "none");
  document.querySelectorAll("[data-perm='settings']").forEach(el => el.style.display = isAdmin ? "flex" : "none");
}

function logActivity(category, description) {
  const currentUser = getActiveUser();
  const now = new Date();
  DB.activityLogs = DB.activityLogs || [];
  DB.activityLogs.unshift({ id: Date.now(), timestamp: now.toLocaleString(), user: currentUser ? currentUser.name : "Admin", category, description });
  saveDB();
}

function renderActivityLogs() {
  const tbody = document.getElementById("activity-log-body");
  if (!tbody) return;
  tbody.innerHTML = (DB.activityLogs || []).map(l => `<tr><td class="mono muted">${l.timestamp}</td><td><b>${l.user}</b></td><td><span class="badge b-pending">${l.category}</span></td><td>${l.description}</td><td></td></tr>`).join("");
}

function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function applyTheme() {}
function applyBranding() {}

const appSidebar = document.getElementById("app-sidebar");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

document.getElementById("btn-open-sidebar")?.addEventListener("click", () => {
  appSidebar.classList.add("open");
  sidebarBackdrop.classList.add("active");
});

function closeSidebar() {
  appSidebar?.classList.remove("open");
  sidebarBackdrop?.classList.remove("active");
}

document.querySelectorAll(".nav-item").forEach(el => {
  el.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    el.classList.add("active");
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = el.dataset.view;
    document.getElementById("view-" + target)?.classList.add("active");
    closeSidebar();
    renderAll();
  });
});

function openModal(id) { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }
document.querySelectorAll("[data-close]").forEach(b => {
  b.addEventListener("click", (e) => e.target.closest(".modal-bg")?.classList.remove("open"));
});

/* =======================================================================
   DASHBOARD CONTROLLER
======================================================================= */
document.querySelectorAll("#dash-period button").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll("#dash-period button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    dashPeriod = b.dataset.p;
    renderDashboard();
  });
});

function renderDashboard() {
  const { orders, expenses } = getPeriodFilteredData(dashPeriod, false);
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

  const statuses = ["pending", "shipped", "delivered", "returned", "cancelled"];
  const statusGrid = document.getElementById("dash-status-grid");
  if (statusGrid) {
    statusGrid.innerHTML = statuses.map(st => `
      <div class="card stat stat-blue">
        <div class="label">${st}</div>
        <div class="value">${orders.filter(o => o.status === st).length}</div>
      </div>
    `).join("");
  }

  const recent = [...orders].sort((a, b) => (b.date + b.invoice).localeCompare(a.date + a.invoice)).slice(0, 6);
  const tbody = document.getElementById("dash-recent");
  if (tbody) {
    tbody.innerHTML = recent.length ? recent.map(o => `
      <tr>
        <td><b>${o.invoice}</b><br><span class="muted mono" style="font-size:10.5px">${o.date}</span></td>
        <td>${o.name}</td>
        <td class="mono"><b>${o.tracking || "—"}</b></td>
        <td>${o.courier}</td>
        <td>${statusBadge(o.status)}</td>
        <td class="num mono"><b>${money(o.grandTotal)}</b></td>
      </tr>`).join("") : `<tr><td colspan="6" class="tbl-empty">No records found</td></tr>`;
  }
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

document.getElementById("ws-cart-product-select")?.addEventListener("change", syncWholesaleCartInputs);

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
      const prevW = DB.wholesale[idx];
      if (prevW.stockDeducted) {
        prevW.items.forEach(it => {
          const prod = DB.products.find(p => p.id === it.productId);
          if (prod) restoreFIFOBatches(prod, it.qty);
        });
      }
      DB.wholesale[idx] = {
        ...prevW,
        date, clientName, phone, address, courier, tracking,
        courierCost, packagingCost, items: [...activeWholesaleCart],
        bill, paid, due, totalCost, profit, status, stockDeducted: true
      };
      activeWholesaleCart.forEach(it => {
        const prod = DB.products.find(p => p.id === it.productId);
        if (prod) deductFIFOBatches(prod, it.qty);
      });
      toast("পাইকারি অর্ডার আপডেট হয়েছে");
    }
  } else {
    const newInvoice = nextWholesaleInvoice();
    const newWs = {
      id: Date.now(), invoice: newInvoice,
      date, clientName, phone, address, courier, tracking,
      courierCost, packagingCost, items: [...activeWholesaleCart],
      bill, paid, due, totalCost, profit, status, stockDeducted: true
    };
    activeWholesaleCart.forEach(it => {
      const prod = DB.products.find(p => p.id === it.productId);
      if (prod) deductFIFOBatches(prod, it.qty);
    });
    DB.wholesale.push(newWs);
    toast("পাইকারি অর্ডার এন্ট্রি সাথে সাথেই স্টক থেকে মাইনাস হয়েছে");
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

function renderWholesale() {
  const searchTerm = (document.getElementById("ws-search") ? document.getElementById("ws-search").value : "").toLowerCase();
  let list = [...DB.wholesale].sort((a, b) => (b.date + b.invoice).localeCompare(a.date + a.invoice));
  if (wholesaleStatusFilter !== "all") list = list.filter(w => (w.status || "pending") === wholesaleStatusFilter);
  if (searchTerm) list = list.filter(w => w.clientName.toLowerCase().includes(searchTerm) || (w.phone || "").includes(searchTerm));

  document.getElementById("ws-stat-total").textContent = money(DB.wholesale.reduce((s, w) => s + w.bill, 0));
  document.getElementById("ws-stat-paid").textContent = money(DB.wholesale.reduce((s, w) => s + w.paid, 0));
  document.getElementById("ws-stat-due").textContent = money(DB.wholesale.reduce((s, w) => s + w.due, 0));
  document.getElementById("ws-stat-profit").textContent = money(DB.wholesale.reduce((s, w) => s + w.profit, 0));

  const tbody = document.getElementById("ws-table-body");
  if (!tbody) return;
  tbody.innerHTML = list.length ? list.map(w => `
    <tr>
      <td><b>${w.invoice}</b></td>
      <td class="mono muted">${w.date}</td>
      <td><b>${w.clientName}</b><br><span class="muted mono" style="font-size:11px">${w.phone || "—"}</span></td>
      <td style="max-width:180px; font-size:11.5px">${w.items ? w.items.map(i => `${i.name} (${i.qty})`).join(", ") : "—"}</td>
      <td><b>${w.courier || "Direct"}</b></td>
      <td class="num mono"><b>${money(w.bill)}</b></td>
      <td class="num mono text-emerald-600 font-bold">${money(w.paid)}</td>
      <td class="num mono text-rose-600 font-bold">${money(w.due)}</td>
      <td class="num mono text-amber-600">${money(w.totalCost)}</td>
      <td class="num mono text-indigo-600 font-bold">${money(w.profit)}</td>
      <td><span class="badge b-${w.status || 'pending'}">${w.status || 'pending'}</span></td>
      <td style="text-align:center">
        <button class="btn sm ghost" onclick="openOrderPreview(${w.id}, true)" title="Preview Items">Preview</button>
        <button class="btn ghost sm" onclick="openWholesaleModal(${w.id})" title="Edit Order Details">Edit</button>
        <button class="btn danger sm" onclick="deleteWholesale(${w.id})">✕</button>
      </td>
    </tr>
  `).join("") : `<tr><td colspan="12" class="tbl-empty">কোনো পাইকারি রেকর্ড নেই</td></tr>`;
}

function deleteWholesale(id) {
  if (!confirm("পাইকারি অর্ডারটি মুছে ফেলতে চান?")) return;
  const w = DB.wholesale.find(x => x.id === id);
  if (w && w.stockDeducted && w.items) {
    w.items.forEach(it => {
      const prod = DB.products.find(p => p.id === it.productId);
      if (prod) restoreFIFOBatches(prod, it.qty);
    });
  }
  DB.wholesale = DB.wholesale.filter(x => x.id !== id);
  saveDB(); renderWholesale();
}

/* =======================================================================
   PRODUCTS & PACKAGING
======================================================================= */
function openNewProductModal() {
  editingProductId = null;
  document.getElementById("product-modal-title").textContent = "Add New Product & Batch";
  document.getElementById("f-prod-name").value = "";
  document.getElementById("f-prod-sku").value = "";
  document.getElementById("f-prod-sell").value = "";
  document.getElementById("f-prod-stock").value = 0;
  document.getElementById("f-prod-cost").value = "";
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
  document.getElementById("f-prod-cost").value = getFIFOCost(p, 1);
  openModal("modal-product");
}

document.getElementById("btn-save-product").addEventListener("click", () => {
  const name = document.getElementById("f-prod-name").value.trim();
  const sku = document.getElementById("f-prod-sku").value.trim();
  const sell = Number(document.getElementById("f-prod-sell").value) || 0;
  const stock = Number(document.getElementById("f-prod-stock").value) || 0;
  const cost = Number(document.getElementById("f-prod-cost").value) || 0;
  if (!name) return;

  if (editingProductId) {
    const p = DB.products.find(x => x.id === editingProductId);
    p.name = name; p.sku = sku; p.sellPrice = sell; p.stock = stock;
    if (p.batches && p.batches.length > 0) p.batches[0].cost = cost;
    else p.batches = [{ batchNo: "LOT-01", qty: stock, cost, expiryDate: "" }];
    toast("প্রোডাক্ট আপডেট হয়েছে");
  } else {
    DB.products.push({
      id: Date.now(), name, sku, sellPrice: sell, stock, alertLimit: 20, image: "",
      batches: [{ batchNo: "LOT-01", qty: stock, cost, expiryDate: "" }]
    });
    toast("নতুন প্রোডাক্ট যুক্ত হয়েছে");
  }
  saveDB(); closeModal("modal-product"); renderProducts();
});

function deleteProduct(id) {
  if (!confirm("প্রোডাক্ট মুছে ফেলবেন?")) return;
  DB.products = DB.products.filter(p => p.id !== id);
  saveDB(); renderProducts();
}

function renderProducts() {
  const tbody = document.getElementById("product-table-body");
  if (!tbody) return;
  document.getElementById("prod-total-items").textContent = DB.products.length;
  document.getElementById("prod-total-stock-qty").textContent = `${DB.products.reduce((s, p) => s + Number(p.stock || 0), 0)} pcs`;

  tbody.innerHTML = DB.products.map(p => `
    <tr>
      <td>📦</td>
      <td><b>${p.name}</b></td>
      <td class="mono muted">${p.sku || "—"}</td>
      <td>Batch</td>
      <td class="num mono text-amber-600"><b>${money(getFIFOCost(p, 1))}</b></td>
      <td class="num mono">${money(p.sellPrice)}</td>
      <td class="num mono font-bold"><b>${p.stock}</b></td>
      <td class="num mono muted">${p.alertLimit || 20} pcs</td>
      <td class="num mono text-blue-600"><b>${money(getFIFOCost(p, 1) * p.stock)}</b></td>
      <td><span class="badge ${p.stock <= 0 ? 'b-out-stock' : 'b-in-stock'}">${p.stock <= 0 ? 'Out of Stock' : 'In Stock'}</span></td>
      <td>
        <button class="btn ghost sm" onclick="editProduct(${p.id})">Edit</button>
        <button class="btn danger sm" onclick="deleteProduct(${p.id})">✕</button>
      </td>
    </tr>`).join("");
}

function renderPackaging() {
  const tbody = document.getElementById("packaging-table-body");
  if (!tbody) return;
  tbody.innerHTML = DB.packaging.map(pk => `
    <tr>
      <td><b>${pk.name}</b></td>
      <td class="num mono">৳${pk.cost}</td>
      <td class="num mono"><b>${pk.stock}</b></td>
      <td class="num mono muted">20 pcs</td>
      <td class="num mono text-blue-600">৳${pk.cost * pk.stock}</td>
      <td><span class="badge b-in-stock">Normal</span></td>
      <td><button class="btn danger sm" onclick="deletePackaging(${pk.id})">✕</button></td>
    </tr>
  `).join("");
}

function deletePackaging(id) {
  DB.packaging = DB.packaging.filter(x => x.id !== id);
  saveDB(); renderPackaging();
}

/* =======================================================================
   RETAIL ORDERS (INSTANT STOCK DEDUCTION & PREVIEW)
======================================================================= */
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

document.getElementById("cart-product-select")?.addEventListener("change", syncCartInputs);

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
  editingOrderId = null;
  activeCart = [];
  document.getElementById("order-modal-title").textContent = "New Order Entry";
  document.getElementById("f-order-date").value = todayStr();
  document.getElementById("f-order-name").value = "";
  document.getElementById("f-order-phone").value = "";
  document.getElementById("f-order-address").value = "";
  document.getElementById("f-order-delivery").value = 80;
  document.getElementById("f-order-advance").value = 0;
  document.getElementById("f-order-discount").value = 0;
  document.getElementById("f-order-status").value = "pending";
  populateCartSelectors();
  renderCartTable();
  openModal("modal-order");
}

function editOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  editingOrderId = id;
  document.getElementById("order-modal-title").textContent = "Edit Order — " + o.invoice;
  document.getElementById("f-order-date").value = o.date;
  document.getElementById("f-order-courier").value = o.courier || "Steadfast";
  document.getElementById("f-order-tracking").value = o.tracking || "";
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

  if (editingOrderId) {
    const idx = DB.orders.findIndex(x => x.id === editingOrderId);
    const prevOrder = DB.orders[idx];
    if (prevOrder.stockDeducted) revertAutomaticDeductions(prevOrder);
    DB.orders[idx] = { ...prevOrder, ...data, stockDeducted: false };
    applyAutomaticDeductions(DB.orders[idx]);
    toast("অর্ডার আপডেট হয়েছে");
  } else {
    const newInvoice = nextInvoice();
    const newOrd = { id: Date.now(), invoice: newInvoice, stockDeducted: false, ...data };
    applyAutomaticDeductions(newOrd);
    DB.orders.push(newOrd);
    toast("নতুন অর্ডার এন্ট্রি সাথে সাথেই স্টক থেকে মাইনাস হয়েছে");
  }

  saveDB(); closeModal("modal-order"); renderOrders();
});

function quickStatus(id, st) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  o.status = st;
  saveDB(); renderOrders();
}

document.getElementById("order-search")?.addEventListener("input", (e) => {
  orderSearchTerm = e.target.value.trim().toLowerCase();
  renderOrders();
});

function renderOrders() {
  let list = [...DB.orders].sort((a, b) => (b.date + b.invoice).localeCompare(a.date + a.invoice));
  document.getElementById("ord-met-total").textContent = DB.orders.length;
  document.getElementById("ord-met-delivered").textContent = DB.orders.filter(o => o.status === "delivered").length;
  document.getElementById("ord-met-pending").textContent = DB.orders.filter(o => o.status === "pending" || o.status === "shipped").length;
  document.getElementById("ord-met-returned").textContent = DB.orders.filter(o => o.status === "returned" || o.status === "cancelled").length;

  if (orderStatusFilter !== "all") list = list.filter(o => o.status === orderStatusFilter);
  if (orderSearchTerm) list = list.filter(o => o.name.toLowerCase().includes(orderSearchTerm) || (o.phone || "").includes(orderSearchTerm));

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
        <td><b>${o.name}</b><br><span class="muted mono" style="font-size:11px">${o.phone}</span></td>
        <td style="max-width:220px; line-height:1.4">${itemsListHtml}</td>
        <td class="mono">${o.tracking || 'No Track'}</td>
        <td>${o.courier}</td>
        <td class="num mono"><b>${money(o.grandTotal)}</b></td>
        <td class="num mono text-amber-600">${money(o.totalCOGS)}</td>
        <td>
          <select onchange="quickStatus(${o.id}, this.value)" style="border:1px solid var(--line);border-radius:6px;padding:3px;font-size:11px">
            ${["pending", "shipped", "delivered", "returned", "cancelled"].map(s => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </td>
        <td style="text-align:center">
          <button class="btn sm ghost" onclick="openOrderPreview(${o.id}, false)" title="Preview Items">Preview</button>
          <button class="btn ghost sm" onclick="editOrder(${o.id})">Edit</button>
          <button class="btn danger sm" onclick="deleteOrder(${o.id})">✕</button>
        </td>
      </tr>`;
  }).join("") : `<tr><td colspan="10" class="tbl-empty">No orders found</td></tr>`;
}

function deleteOrder(id) {
  if (!confirm("অর্ডার মুছে ফেলবেন?")) return;
  const o = DB.orders.find(x => x.id === id);
  if (o && o.stockDeducted) revertAutomaticDeductions(o);
  DB.orders = DB.orders.filter(o => o.id !== id);
  saveDB(); renderOrders();
}

/* =======================================================================
   CSV IMPORT/EXPORT WITH PASSWORD PROTECTION ("159357")
======================================================================= */
function exportOrdersToCSV() {
  const enteredPass = prompt("🔒 নিরাপত্তা যাচাই:\nOrders Report CSV ডাউনলোড করতে পাসওয়ার্ড (159357) দিন:");
  if (enteredPass === null) return;
  if (enteredPass === CSV_SECURITY_PASS) {
    let csv = "Invoice,Date,Customer,Phone,Courier,Tracking,Status,Total\n";
    DB.orders.forEach(o => csv += `"${o.invoice}","${o.date}","${o.name}","${o.phone}","${o.courier}","${o.tracking || ''}","${o.status}",${o.grandTotal}\n`);
    downloadCSV(csv, `orders-${todayStr()}.csv`);
    toast("CSV ফাইল সফলভাবে ডাউনলোড হয়েছে");
  } else {
    alert("❌ ভুল পাসওয়ার্ড!");
  }
}

function exportProfitCSV() {
  const enteredPass = prompt("🔒 নিরাপত্তা যাচাই:\nProfit & Loss CSV ডাউনলোড করতে পাসওয়ার্ড (159357) দিন:");
  if (enteredPass === null) return;
  if (enteredPass === CSV_SECURITY_PASS) {
    const { orders, expenses } = getPeriodFilteredData(reportPeriod, true);
    const rev = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.grandTotal, 0);
    downloadCSV(`Revenue,${rev}\nExpenses,${expenses.reduce((s, e) => s + Number(e.amount || 0), 0)}\n`, "Profit_Report.csv");
    toast("CSV ফাইল সফলভাবে ডাউনলোড হয়েছে");
  } else {
    alert("❌ ভুল পাসওয়ার্ড!");
  }
}

function exportProductCSV() {
  const enteredPass = prompt("🔒 নিরাপত্তা যাচাই:\nProduct Sales Performance CSV ডাউনলোড করতে পাসওয়ার্ড (159357) দিন:");
  if (enteredPass === null) return;
  if (enteredPass === CSV_SECURITY_PASS) {
    let csv = "Product,Orders\n";
    DB.products.forEach(p => csv += `"${p.name}",${p.stock}\n`);
    downloadCSV(csv, "Products_Report.csv");
    toast("CSV ফাইল সফলভাবে ডাউনলোড হয়েছে");
  } else {
    alert("❌ ভুল পাসওয়ার্ড!");
  }
}

function exportCourierCSV() {
  const enteredPass = prompt("🔒 নিরাপত্তা যাচাই:\nCourier Audit CSV ডাউনলোড করতে পাসওয়ার্ড (159357) দিন:");
  if (enteredPass === null) return;
  if (enteredPass === CSV_SECURITY_PASS) {
    let csv = "Invoice,Courier,Status,Amount\n";
    DB.orders.forEach(o => csv += `"${o.invoice}","${o.courier}","${o.status}",${o.grandTotal}\n`);
    downloadCSV(csv, "Courier_Report.csv");
    toast("CSV ফাইল সফলভাবে ডাউনলোড হয়েছে");
  } else {
    alert("❌ ভুল পাসওয়ার্ড!");
  }
}

function downloadCSV(content, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8;" }));
  a.download = filename;
  a.click();
}

document.getElementById("file-import-csv")?.addEventListener("change", (e) => {
  const enteredPass = prompt("🔒 নিরাপত্তা যাচাই:\nCSV ফাইল ইমপোর্ট করতে পাসওয়ার্ড (159357) দিন:");
  if (enteredPass === null) { e.target.value = ""; return; }
  
  if (enteredPass === CSV_SECURITY_PASS) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const text = event.target.result;
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

        applyAutomaticDeductions(importedOrder);
        DB.orders.push(importedOrder);
        importedCount++;
      }

      saveDB();
      logActivity("CSV Import", `Imported ${importedCount} orders`);
      renderAll();
      toast(`সফলভাবে ${importedCount} টি অর্ডার ইমপোর্ট হয়েছে`);
    };
    reader.readAsText(file);
    e.target.value = "";
  } else {
    alert("❌ ভুল পাসওয়ার্ড! ইমপোর্ট বাতিল করা হয়েছে।");
    e.target.value = "";
  }
});

/* =======================================================================
   REPORTS & ACCOUNTING (DEFAULT: TODAY)
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
  const { orders, expenses } = getPeriodFilteredData(reportPeriod, true);
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
  document.getElementById("rep-p-profit").textContent = money(netProfit);
}

function renderAccounting() {}
function renderCustomers() {}
function renderUsers() {}
function renderCourierManagement() {}

/* =======================================================================
   SECURE BACKEND & DATA MANAGEMENT (PASSWORD: 01814492196)
======================================================================= */
document.getElementById("btn-export")?.addEventListener("click", () => {
  const enteredPass = prompt("🔒 নিরাপত্তা যাচাই:\nব্যাকআপ ফাইল (Export JSON) ডাউনলোড করতে পাসওয়ার্ড দিন:");
  if (enteredPass === null) return;
  if (enteredPass === "01814492196") {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DB, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `noorish_erp_backup_${todayStr()}.json`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
    toast("সফলভাবে ব্যাকআপ ফাইল ডাউনলোড হয়েছে");
  } else {
    alert("❌ ভুল পাসওয়ার্ড! ব্যাকআপ ডাউনলোড বাতিল করা হয়েছে।");
  }
});

document.getElementById("btn-import-trigger")?.addEventListener("click", () => {
  const enteredPass = prompt("🔒 নিরাপত্তা যাচাই:\nসিস্টেম রিস্টোর (Restore JSON) করতে পাসওয়ার্ড দিন:");
  if (enteredPass === null) return;
  if (enteredPass === "01814492196") {
    document.getElementById('file-import')?.click();
  } else {
    alert("❌ ভুল পাসওয়ার্ড! রিস্টোর প্রক্রিয়া বাতিল করা হয়েছে।");
  }
});

document.getElementById("file-import")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (parsed && parsed.orders && parsed.products) {
        DB = parsed;
        saveDB();
        applyTheme();
        applyBranding();
        renderAll();
        toast("সফলভাবে সিস্টেম ডেটা রিস্টোর করা হয়েছে");
      } else {
        alert("❌ ফাইল ফরম্যাট সঠিক নয়!");
      }
    } catch (err) {
      alert("❌ ব্যাকআপ ফাইলটি রিড করা সম্ভব হয়নি!");
    }
  };
  reader.readAsText(file);
});

document.getElementById("btn-reset-all")?.addEventListener("click", () => {
  const currentUser = getActiveUser();
  if (!currentUser || (currentUser.role !== "Admin" && currentUser.name !== "Super Admin")) {
    toast("⚠️ শুধুমাত্র সুপার এডমিন সিস্টেম রিসেট করতে পারবেন!");
    return;
  }
  const enteredPass = prompt("⚠️ চরম সতর্কবার্তা!\nসব ডেটা চিরতরে মুছে ফেলতে পাসওয়ার্ড (01814492196) লিখুন:");
  if (enteredPass === null) return;
  if (enteredPass === "01814492196") {
    if (confirm("শেষবারের মতো নিশ্চিত করুন: আপনি কি সত্যিই সমস্ত ডাটা রিসেট করতে চান?")) {
      localStorage.removeItem(DB_KEY);
      DB = defaultDB(); 
      applyTheme(); 
      applyBranding(); 
      renderAll();
      saveDB();
      toast("সিস্টেমের সমস্ত ডেটা সফলভাবে রিসেট করা হয়েছে");
    }
  } else {
    alert("❌ ভুল পাসওয়ার্ড! সিস্টেম রিসেট বাতিল করা হয়েছে।");
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

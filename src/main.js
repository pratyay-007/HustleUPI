import "./styles.css";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode";
import { splitAmount, TRANCHE_CEILING } from "./split.js";
import { buildUpiUri, isValidVpa, parsePayee } from "./upi.js";

const CEILING_MESSAGE = `Each tranche must stay under ₹${TRANCHE_CEILING + 1}.`;

const els = {
  screens: [...document.querySelectorAll(".screen")],
  scanCard: document.querySelector(".scan-card"),
  scanStatus: document.getElementById("scan-status"),
  scanError: document.getElementById("scan-error"),
  cameraRetry: document.getElementById("camera-retry"),
  uploadQr: document.getElementById("upload-qr"),
  enterVpa: document.getElementById("enter-vpa"),
  qrFile: document.getElementById("qr-file"),
  vpaPanel: document.getElementById("vpa-panel"),
  vpaForm: document.getElementById("vpa-form"),
  vpaInput: document.getElementById("vpa-input"),
  vpaName: document.getElementById("vpa-name"),
  vpaError: document.getElementById("vpa-error"),
  vpaCancel: document.getElementById("vpa-cancel"),
  amountName: document.getElementById("amount-merchant-name"),
  amountVpa: document.getElementById("amount-merchant-vpa"),
  billAmount: document.getElementById("bill-amount"),
  amountError: document.getElementById("amount-error"),
  splitPreview: document.getElementById("split-preview"),
  splitPreviewLabel: document.getElementById("split-preview-label"),
  trancheChips: document.getElementById("tranche-chips"),
  btnSplit: document.getElementById("btn-split"),
  amountBack: document.getElementById("amount-back"),
  progress: document.getElementById("progress-segments"),
  trancheLabel: document.getElementById("tranche-label"),
  splitName: document.getElementById("split-merchant-name"),
  splitVpa: document.getElementById("split-merchant-vpa"),
  trancheAmountDisplay: document.getElementById("tranche-amount-display"),
  trancheError: document.getElementById("tranche-error"),
  payQr: document.getElementById("pay-qr"),
  payLink: document.getElementById("pay-link"),
  payLabel: document.getElementById("pay-label"),
  markPaid: document.getElementById("mark-paid"),
  completeCount: document.getElementById("complete-count"),
  completeTotal: document.getElementById("complete-total"),
  completeMerchant: document.getElementById("complete-merchant"),
  startNew: document.getElementById("start-new"),
};

const state = createInitialState();
let camera = null;
let cameraRunning = false;
let cameraStarting = false;
let handlingScan = false;

function createInitialState() {
  return {
    view: "scan",
    returnView: "scan",
    payee: { vpa: "", name: "" },
    total: 0,
    tranches: [],
    currentIndex: 0,
    paid: [],
  };
}

function resetState() {
  Object.assign(state, createInitialState());
}

function rupees(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function parseRupees(raw) {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number.parseInt(digits, 10);
}

function showError(node, message) {
  if (!message) {
    node.hidden = true;
    node.textContent = "";
    return;
  }
  node.hidden = false;
  node.textContent = message;
}

function merchantLabel() {
  return state.payee.name || state.payee.vpa;
}

function setView(view) {
  const staticViews = ["about", "privacy", "terms", "cookie"];
  if (!staticViews.includes(view)) {
    state.view = view;
    state.returnView = view;
  }

  const visible = staticViews.includes(view) ? view : state.view;
  for (const screen of els.screens) {
    screen.classList.toggle("hidden", screen.dataset.view !== visible);
  }

  if (visible === "scan") {
    startCamera();
  } else {
    stopCamera();
  }
}

function applyHashRoute() {
  if (location.hash === "#about") { setView("about"); return; }
  if (location.hash === "#privacy") { setView("privacy"); return; }
  if (location.hash === "#terms") { setView("terms"); return; }
  if (location.hash === "#cookie") { setView("cookie"); return; }
  if (location.hash === "#scan") { setView("scan"); return; }
  setView(state.returnView || state.view || "scan");
}

async function startCamera() {
  els.cameraRetry.classList.add("hidden");
  const staticViews = ["#about", "#privacy", "#terms", "#cookie"];
  if (cameraRunning || cameraStarting || staticViews.includes(location.hash)) return;

  cameraStarting = true;
  try {
    if (!camera) {
      camera = new Html5Qrcode("qr-reader", { verbose: false });
    }
    await camera.start(
      { facingMode: "environment" },
      { fps: 8 },
      onScanSuccess,
      () => {},
    );
    cameraRunning = true;
    els.scanCard.classList.add("is-live");
    els.scanStatus.textContent = "Point at the merchant QR";
  } catch (error) {
    cameraRunning = false;
    els.scanCard.classList.remove("is-live");
    els.cameraRetry.classList.remove("hidden");
    if (!window.isSecureContext) {
      els.scanStatus.textContent = "Camera blocked: Requires HTTPS. Use upload or VPA entry until deployed.";
    } else {
      els.scanStatus.textContent = "Camera unavailable — upload a QR or enter the VPA";
    }
    console.warn("Camera start failed", error);
  } finally {
    cameraStarting = false;
  }
}

async function stopCamera() {
  if (!camera || !cameraRunning) return;
  cameraRunning = false;
  els.scanCard.classList.remove("is-live");
  try {
    await camera.stop();
    await camera.clear();
  } catch {
    // Already stopped.
  }
}

function onScanSuccess(decodedText) {
  if (handlingScan) return;
  handlingScan = true;
  try {
    acceptPayee(parsePayee(decodedText));
  } catch (error) {
    showError(els.scanError, error.message);
    handlingScan = false;
  }
}

function acceptPayee(payee) {
  showError(els.scanError, "");
  els.vpaPanel.classList.add("hidden");
  state.payee = payee;
  state.total = 0;
  state.tranches = [];
  state.currentIndex = 0;
  state.paid = [];
  els.billAmount.value = "";
  renderAmountScreen();
  const staticViews = ["#about", "#privacy", "#terms", "#cookie"];
  if (staticViews.includes(location.hash)) {
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
  setView("amount");
  handlingScan = false;
}

function renderAmountScreen() {
  els.amountName.textContent = merchantLabel();
  els.amountVpa.textContent = state.payee.vpa;
  updateSplitPreview();
}

function updateSplitPreview() {
  const total = parseRupees(els.billAmount.value);
  const parts = splitAmount(total);
  showError(els.amountError, "");

  if (!parts.length) {
    els.splitPreview.hidden = true;
    els.btnSplit.disabled = true;
    return;
  }

  els.splitPreview.hidden = false;
  els.btnSplit.disabled = false;
  const label =
    parts.length === 1
      ? "One payment — under the ₹2,000 threshold"
      : `${parts.length} tranches`;
  els.splitPreviewLabel.textContent = label;
  els.trancheChips.innerHTML = parts
    .map((amount, index) => `<li>T${index + 1} ${rupees(amount)}</li>`)
    .join("");
}

function beginSplit() {
  const total = parseRupees(els.billAmount.value);
  const parts = splitAmount(total);
  if (!parts.length) {
    showError(els.amountError, "Enter a whole-rupee bill amount.");
    return;
  }
  state.total = total;
  state.tranches = parts;
  state.currentIndex = 0;
  state.paid = [];
  renderSplitCard();
  setView("split");
}

function currentTrancheAmount() {
  return state.tranches[state.currentIndex];
}

function trancheIsValid(amount) {
  return Number.isInteger(amount) && amount >= 1 && amount <= TRANCHE_CEILING;
}

async function renderSplitCard() {
  const index = state.currentIndex;
  const totalCount = state.tranches.length;
  const amount = state.tranches[index];

  els.trancheLabel.textContent = `Tranche ${index + 1} of ${totalCount}`;
  els.splitName.textContent = merchantLabel();
  els.splitVpa.textContent = state.payee.vpa;
  els.trancheAmountDisplay.textContent = rupees(amount);

  els.progress.innerHTML = state.tranches
    .map((_, i) => {
      const cls = i < index ? "is-done" : i === index ? "is-current" : "";
      return `<span class="${cls}"></span>`;
    })
    .join("");

  await syncTranchePayment();
}

async function syncTranchePayment() {
  const amount = currentTrancheAmount();
  const valid = trancheIsValid(amount);
  els.payLink.classList.toggle("is-disabled", !valid);
  els.markPaid.disabled = !valid;

  if (!valid) {
    showError(
      els.trancheError,
      amount >= TRANCHE_CEILING + 1 ? CEILING_MESSAGE : "Enter a whole-rupee amount of at least ₹1.",
    );
    els.payLink.removeAttribute("href");
    els.payLabel.textContent = "Pay";
    return;
  }

  showError(els.trancheError, "");
  state.tranches[state.currentIndex] = amount;
  const uri = buildUpiUri(state.payee.vpa, state.payee.name, amount);
  els.payLink.href = uri;
  els.payLabel.textContent = `Pay ${rupees(amount)}`;

  try {
    await QRCode.toCanvas(els.payQr, uri, {
      width: 220,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch (error) {
    showError(els.trancheError, "Could not generate this payment QR.");
    console.warn(error);
  }
}

async function markCurrentPaid() {
  const amount = currentTrancheAmount();
  if (!trancheIsValid(amount)) {
    syncTranchePayment();
    return;
  }
  
  const card = document.querySelector(".split-card");
  card.classList.add("swipe-out");
  
  await new Promise(resolve => {
    card.addEventListener("animationend", resolve, { once: true });
    setTimeout(resolve, 350); // Fallback
  });
  
  card.classList.remove("swipe-out");
  state.paid.push(amount);
  
  if (state.currentIndex >= state.tranches.length - 1) {
    renderComplete();
    setView("complete");
    return;
  }
  state.currentIndex += 1;
  renderSplitCard();
  
  card.classList.add("swipe-in");
  card.addEventListener("animationend", () => card.classList.remove("swipe-in"), { once: true });
}

function renderComplete() {
  const totalPaid = state.paid.reduce((sum, n) => sum + n, 0);
  els.completeCount.textContent = String(state.paid.length);
  els.completeTotal.textContent = rupees(totalPaid);
  els.completeMerchant.textContent = merchantLabel();
}

function startNewSplit() {
  resetState();
  els.billAmount.value = "";
  els.vpaInput.value = "";
  els.vpaName.value = "";
  showError(els.scanError, "");
  location.hash = "scan";
  setView("scan");
}

els.uploadQr.addEventListener("click", () => els.qrFile.click());
els.cameraRetry.addEventListener("click", () => {
  startCamera();
});

els.qrFile.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  await stopCamera();
  const fileScanner = new Html5Qrcode("qr-file-reader", { verbose: false });
  try {
    const decodedText = await fileScanner.scanFile(file, false);
    acceptPayee(parsePayee(decodedText));
  } catch (error) {
    showError(els.scanError, "Could not read a UPI QR from that image.");
    console.warn(error);
    startCamera();
  } finally {
    try {
      await fileScanner.clear();
    } catch {
      // File scanner has no persistent UI to tear down.
    }
  }
});

els.enterVpa.addEventListener("click", () => {
  showError(els.vpaError, "");
  els.vpaPanel.classList.remove("hidden");
  els.vpaInput.focus();
});

els.vpaCancel.addEventListener("click", () => {
  els.vpaPanel.classList.add("hidden");
});

els.vpaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const vpa = els.vpaInput.value.trim();
  if (!isValidVpa(vpa)) {
    showError(els.vpaError, "Enter a UPI ID like merchant@upi.");
    return;
  }
  acceptPayee({ vpa, name: els.vpaName.value.trim() });
});

els.billAmount.addEventListener("input", updateSplitPreview);
els.btnSplit.addEventListener("click", beginSplit);
els.amountBack.addEventListener("click", () => {
  setView("scan");
});



els.payLink.addEventListener("click", (event) => {
  if (!els.payLink.getAttribute("href")) {
    event.preventDefault();
  }
});

els.markPaid.addEventListener("click", markCurrentPaid);
els.startNew.addEventListener("click", startNewSplit);

window.addEventListener("hashchange", applyHashRoute);
applyHashRoute();

window.addEventListener("load", () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 250);
  }
  const app = document.getElementById("app");
  if (app) {
    app.style.opacity = "1";
    // Once transition is complete, we can clear the inline transition style 
    // to avoid conflicting with other possible css if needed, but it's fine to leave.
  }
});

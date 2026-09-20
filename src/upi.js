const VPA_PATTERN = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9.-]{2,64}$/;

export function isValidVpa(value) {
  return typeof value === "string" && VPA_PATTERN.test(value.trim());
}

function decodePayeeName(raw) {
  if (!raw) return "";
  try {
    return decodeURIComponent(String(raw).replace(/\+/g, " ")).trim();
  } catch {
    return String(raw).replace(/\+/g, " ").trim();
  }
}

function queryFromText(text) {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith("upi://") || lower.startsWith("upi:")) {
    try {
      return new URL(trimmed).searchParams;
    } catch {
      const queryIndex = trimmed.indexOf("?");
      if (queryIndex >= 0) {
        return new URLSearchParams(trimmed.slice(queryIndex + 1));
      }
    }
  }

  if (trimmed.includes("pa=")) {
    const queryIndex = trimmed.indexOf("?");
    const query = queryIndex >= 0 ? trimmed.slice(queryIndex + 1) : trimmed;
    return new URLSearchParams(query);
  }

  return null;
}

/**
 * Extract payee VPA (`pa`) and optional name (`pn`) from a decoded QR / UPI URI / raw VPA.
 *
 * @param {string} raw
 * @returns {{ vpa: string, name: string }}
 */
export function parsePayee(raw) {
  const text = String(raw ?? "").trim();
  if (!text) {
    throw new Error("Nothing to parse.");
  }

  if (isValidVpa(text)) {
    return { vpa: text.trim(), name: "" };
  }

  const params = queryFromText(text);
  if (!params) {
    throw new Error("Could not read a UPI ID from that code.");
  }

  const vpa = (params.get("pa") || "").trim();
  const name = decodePayeeName(params.get("pn") || "");

  if (!isValidVpa(vpa)) {
    throw new Error("That QR did not contain a valid UPI ID.");
  }

  return { vpa, name };
}

/**
 * Build a standard UPI intent URI for one tranche.
 *
 * @param {string} vpa
 * @param {string} [name]
 * @param {number} amount
 */
export function buildUpiUri(vpa, name, amount) {
  const params = new URLSearchParams();
  params.set("pa", vpa);
  if (name) {
    params.set("pn", name);
  }
  params.set("am", String(amount));
  params.set("cu", "INR");
  return `upi://pay?${params.toString()}`;
}

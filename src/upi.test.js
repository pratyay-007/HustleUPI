import assert from "node:assert/strict";
import { test } from "node:test";
import { buildUpiUri, isValidVpa, parsePayee } from "./upi.js";

test("accepts typical VPAs", () => {
  assert.equal(isValidVpa("bluetokai@icici"), true);
  assert.equal(isValidVpa("merchant-name@okaxis"), true);
  assert.equal(isValidVpa("not-a-vpa"), false);
});

test("parses a raw VPA", () => {
  assert.deepEqual(parsePayee("shop@upi"), { vpa: "shop@upi", name: "" });
});

test("parses a full UPI URI", () => {
  const parsed = parsePayee(
    "upi://pay?pa=bluetokai@icici&pn=Blue+Tokai+Coffee&am=4500&cu=INR",
  );
  assert.equal(parsed.vpa, "bluetokai@icici");
  assert.equal(parsed.name, "Blue Tokai Coffee");
});

test("parses a query string without a scheme", () => {
  const parsed = parsePayee("pa=shop@upi&pn=Corner+Store");
  assert.equal(parsed.vpa, "shop@upi");
  assert.equal(parsed.name, "Corner Store");
});

test("builds a tranche payment URI", () => {
  const uri = buildUpiUri("bluetokai@icici", "Blue Tokai Coffee", 1999);
  assert.equal(
    uri,
    "upi://pay?pa=bluetokai%40icici&pn=Blue+Tokai+Coffee&am=1999&cu=INR",
  );
});

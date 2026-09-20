import assert from "node:assert/strict";
import { test } from "node:test";
import { splitAmount, TRANCHE_CEILING } from "./split.js";

test("single payment when total is at or under the ceiling", () => {
  assert.deepEqual(splitAmount(1), [1]);
  assert.deepEqual(splitAmount(1999), [1999]);
  assert.deepEqual(splitAmount(1998), [1998]);
});

test("splits just over the ceiling into two even tranches", () => {
  assert.deepEqual(splitAmount(2000), [1000, 1000]);
});

test("uses the minimum number of 1999-sized tranches when exact", () => {
  assert.deepEqual(splitAmount(5997), [1999, 1999, 1999]);
});

test("even-ish split for 5500 rather than 1999 + remainder", () => {
  const parts = splitAmount(5500);
  assert.equal(parts.length, 3);
  assert.equal(parts.reduce((sum, n) => sum + n, 0), 5500);
  assert.ok(parts.every((n) => n <= TRANCHE_CEILING));
  assert.deepEqual(parts, [1833, 1833, 1834]);
});

test("rejects empty or invalid totals", () => {
  assert.deepEqual(splitAmount(0), []);
  assert.deepEqual(splitAmount(-10), []);
  assert.deepEqual(splitAmount(Number.NaN), []);
});

test("never exceeds the ceiling", () => {
  for (const total of [2001, 3998, 3999, 10000, 19990]) {
    const parts = splitAmount(total);
    assert.equal(parts.reduce((sum, n) => sum + n, 0), total);
    assert.ok(parts.every((n) => n <= TRANCHE_CEILING && n >= 1));
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import { decodeEmail, encodeEmail } from "./email.ts";

for (const address of ["owner@example.com", "first.last+tag@mail.example.org", "a@b.co"]) {
  test(`encodeEmail round-trips ${address} without "@"`, () => {
    const encoded = encodeEmail(address);
    assert.equal(decodeEmail(encoded), address);
    assert.ok(!encoded.includes("@"));
  });
}

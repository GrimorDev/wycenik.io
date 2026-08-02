import { describe, expect, it } from "vitest";
import { isValidEmail, isValidPolishPhone } from "@/lib/calculator/validation";

describe("isValidEmail", () => {
  it("accepts well-formed emails", () => {
    expect(isValidEmail("jan@example.com")).toBe(true);
  });

  it("rejects strings without an @ or domain", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("jan@")).toBe(false);
  });
});

describe("isValidPolishPhone", () => {
  it("accepts a 9-digit number", () => {
    expect(isValidPolishPhone("600700800")).toBe(true);
  });

  it("accepts a 9-digit number with formatting", () => {
    expect(isValidPolishPhone("600-700-800")).toBe(true);
    expect(isValidPolishPhone("600 700 800")).toBe(true);
  });

  it("accepts a 48 country code prefix", () => {
    expect(isValidPolishPhone("+48600700800")).toBe(true);
    expect(isValidPolishPhone("48600700800")).toBe(true);
  });

  it("does not misinterpret a 9-digit number starting with 48 as a country code", () => {
    expect(isValidPolishPhone("486007008")).toBe(true);
  });

  it("rejects garbage input", () => {
    expect(isValidPolishPhone("sdsd")).toBe(false);
    expect(isValidPolishPhone("12345")).toBe(false);
    expect(isValidPolishPhone("")).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import {
  getLoginErrorMessage,
  LOGIN_REQUIRED_FIELDS_MESSAGE,
} from "./auth-error";

describe("LOGIN_REQUIRED_FIELDS_MESSAGE", () => {
  it("provides the expected validation message", () => {
    expect(LOGIN_REQUIRED_FIELDS_MESSAGE).toBe(
      "Please enter both email and password.",
    );
  });
});

describe("getLoginErrorMessage", () => {
  it("maps invalid email errors", () => {
    expect(getLoginErrorMessage({ code: "auth/invalid-email" })).toBe(
      "Please enter a valid email address.",
    );
  });

  it("maps invalid credential related errors to a shared message", () => {
    expect(getLoginErrorMessage({ code: "auth/invalid-credential" })).toBe(
      "Incorrect email or password.",
    );
    expect(getLoginErrorMessage({ code: "auth/user-not-found" })).toBe(
      "Incorrect email or password.",
    );
    expect(getLoginErrorMessage({ code: "auth/wrong-password" })).toBe(
      "Incorrect email or password.",
    );
  });

  it("maps disabled account errors", () => {
    expect(getLoginErrorMessage({ code: "auth/user-disabled" })).toBe(
      "This account has been disabled. Contact support.",
    );
  });

  it("maps too many requests errors", () => {
    expect(getLoginErrorMessage({ code: "auth/too-many-requests" })).toBe(
      "Too many failed attempts. Please try again later.",
    );
  });

  it("maps network errors", () => {
    expect(getLoginErrorMessage({ code: "auth/network-request-failed" })).toBe(
      "Network error. Check your connection and try again.",
    );
  });

  it("returns fallback for unknown and malformed errors", () => {
    expect(getLoginErrorMessage({ code: "auth/something-else" })).toBe(
      "Unable to log in right now. Please try again.",
    );
    expect(getLoginErrorMessage(new Error("boom"))).toBe(
      "Unable to log in right now. Please try again.",
    );
    expect(getLoginErrorMessage(null)).toBe(
      "Unable to log in right now. Please try again.",
    );
    expect(getLoginErrorMessage("plain string error")).toBe(
      "Unable to log in right now. Please try again.",
    );
  });
});

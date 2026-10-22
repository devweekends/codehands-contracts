import { describe, expect, it } from "vitest";
import { canTransition, RUNNER_EVENT_TYPES } from "../src/index.js";

describe("session transitions", () => {
  it("allows the happy path", () => {
    expect(canTransition("queued", "running")).toBe(true);
    expect(canTransition("running", "awaiting_approval")).toBe(true);
    expect(canTransition("awaiting_approval", "approved")).toBe(true);
  });

  it("allows stop and resume", () => {
    expect(canTransition("running", "stopped")).toBe(true);
    expect(canTransition("stopped", "running")).toBe(true);
  });

  it("refuses approving a running session and resuming an approved one", () => {
    expect(canTransition("running", "approved")).toBe(false);
    expect(canTransition("approved", "running")).toBe(false);
  });
});

describe("event names", () => {
  it("has no duplicates", () => {
    expect(new Set(RUNNER_EVENT_TYPES).size).toBe(RUNNER_EVENT_TYPES.length);
  });
});

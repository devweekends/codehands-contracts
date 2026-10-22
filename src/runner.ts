// The boundary between the daemon (Midhat) and the runner (Tahira).
// The daemon calls Runner methods. The runner yields RunnerEvents, the daemon stores and uploads them.

import type { AgentKind } from "./session.js";

export const RUNNER_EVENT_TYPES = [
  "task.started",
  "message",
  "file.read",
  "file.changed",
  "command.started",
  "command.finished",
  "test.result",
  "task.finished",
  "task.failed",
  "task.stopped",
] as const;
export type RunnerEventType = (typeof RUNNER_EVENT_TYPES)[number];

export interface RunnerEvent {
  sessionId: string;
  seq: number;              // 1, 2, 3 … per session. Lets the phone catch up after a reconnect
  type: RunnerEventType;
  at: string;               // ISO time
  payload: Record<string, unknown>;
  raw?: unknown;            // the agent's original line, untouched
}

export interface StartOptions {
  sessionId: string;        // UUID from the server, reused as Claude's --session-id
  repoPath: string;
  prompt: string;
  agent: Exclude<AgentKind, "codehands">;
  model?: string;
  budgetUsd?: number;
}

export interface Runner {
  start(o: StartOptions): AsyncIterable<RunnerEvent>;
  stop(sessionId: string): Promise<void>;
  resume(sessionId: string, prompt?: string): AsyncIterable<RunnerEvent>;
  diff(sessionId: string): Promise<{ patch: string; stat: string }>;
  approve(sessionId: string, message: string): Promise<{ branch: string; commit: string }>;
  reject(sessionId: string): Promise<void>;
}

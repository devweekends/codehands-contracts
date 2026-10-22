// Rows the state API stores (Midhat) and the apps read (Tania, Memoona).

export type SessionStatus =
  | "queued"
  | "running"
  | "stopped"
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "failed";

export type AgentKind = "claude-code" | "codex" | "codehands";
export type CommandKind = "start" | "stop" | "resume" | "approve" | "reject";

export interface Device { id: string; userId: string; name: string; lastSeenAt: string }
export interface Project { id: string; deviceId: string; name: string; path: string }

export interface Session {
  id: string;
  projectId: string;
  status: SessionStatus;
  agent: AgentKind;
  model: string;
  costUsd: number;
  branch?: string;
  baseCommit?: string;
  diff?: string;
  createdAt: string;
}

export interface Command {
  id: string;
  sessionId?: string;
  projectId: string;
  kind: CommandKind;
  createdBy: string;
  createdAt: string;
}

// The only legal moves. Anything else is refused (diagram 1d in the week 1 guide).
export const SESSION_TRANSITIONS: Readonly<Record<SessionStatus, readonly SessionStatus[]>> = {
  queued: ["running", "failed"],
  running: ["stopped", "awaiting_approval", "failed"],
  stopped: ["running", "failed"],
  awaiting_approval: ["approved", "rejected", "failed"],
  approved: [],
  rejected: [],
  failed: [],
};

export function canTransition(from: SessionStatus, to: SessionStatus): boolean {
  return SESSION_TRANSITIONS[from].includes(to);
}

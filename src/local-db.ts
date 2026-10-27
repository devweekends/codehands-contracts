// L1: local database contract for ~/.codehands/state.db (SQLite).
// Matches sql/001_init.sql. One writer per table: SQLite cannot enforce
// this, so TABLE_WRITERS is the agreement every repo follows.
//
// These are RAW ROW shapes: snake_case columns, JSON stored as text, dates as
// ISO strings. The app-facing shapes (Session, Command, Project) live in
// session.ts. Row names end in "Row" so the two never clash.

import type { AgentKind, CommandKind, SessionStatus } from "./session.js";

export const LOCAL_DB_FILENAME = "state.db"; // lives in ~/.codehands/
export const LOCAL_DB_SCHEMA_VERSION = 1;

export type DbWriter = "app" | "daemon";

/** Who may write each table. Everyone else only reads. */
export const TABLE_WRITERS = {
  schema_migrations: "daemon",
  projects: "app",
  tasks: "app",
  commands: "app",
  sessions: "daemon",
  events: "daemon",
  provider_status: "daemon",
  command_receipts: "daemon",
} as const satisfies Record<string, DbWriter>;

export type TableName = keyof typeof TABLE_WRITERS;

// ---- written by the daemon ----

export interface SchemaMigrationRow {
  version: number;
  applied_at: string;
}

// ---- written by the app ----

export interface ProjectRow {
  id: string;
  name: string;
  /** Hash of the origin URL: the same project on every laptop. */
  repo_id: string;
  /** Folder on THIS laptop only. Never synced. */
  path: string;
  created_at: string;
}

/** Model chosen per phase, e.g. { plan: "...", implement: "..." }. */
export type TaskModels = Record<string, string>;

export interface TaskRow {
  id: string;
  project_id: string;
  prompt: string;
  agent: AgentKind;
  /** JSON text of TaskModels. */
  models: string;
  created_by: string;
  created_at: string;
}

export interface CommandRow {
  id: string;
  /** Null only for "start". */
  session_id: string | null;
  project_id: string | null;
  kind: CommandKind;
  created_by: string;
  created_at: string;
}

// ---- written by the daemon ----

export interface SessionRow {
  id: string;
  /** Unique: a task gets at most one session, so it is claimed exactly once. */
  task_id: string;
  project_id: string;
  status: SessionStatus;
  agent: string;
  model: string;
  /** Why a session failed or a task was refused. */
  reason: string | null;
  cost_usd: number;
  branch: string | null;
  base_commit: string | null;
  diff: string | null;
  created_at: string;
  updated_at: string;
}

/** Append only. (session_id, seq) is the key, so a resend is harmless. */
export interface EventRow {
  session_id: string;
  /** 1, 2, 3... per session. */
  seq: number;
  type: string;
  /** JSON text. */
  payload: string;
  created_at: string;
}

export type ProviderState =
  | "ok"
  | "not_installed"
  | "not_logged_in"
  | "rate_limited"
  | "usage_limited"
  | "outage";

export interface ProviderStatusRow {
  /** "claude-code" or "codex". */
  agent: string;
  state: ProviderState;
  reason: string | null;
  /** When a rate or usage limit lifts. */
  retry_at: string | null;
  checked_at: string;
}

/** The daemon cannot edit the app's commands table, so it records the outcome here. */
export interface CommandReceiptRow {
  command_id: string;
  outcome: "done" | "refused";
  reason: string | null;
  handled_at: string;
}
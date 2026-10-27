// cloud-api.ts · C3 Cloud API v0.1.0

export type RecordKind =
  | "project" | "session" | "event"
  | "memory" | "preference";

export interface CloudDevice { id: string; name: string; createdAt: string }

export interface AuthResult {
  userId: string;
  device: CloudDevice;
  deviceToken: string; // per laptop, revoked on logout
}

export interface CloudAuth {
  signUp(input: { githubCode: string; deviceName: string }): Promise<AuthResult>;
  logIn(input: { githubCode: string; deviceName: string }): Promise<AuthResult>;
  logOut(): Promise<{ ok: true }>; // revokes only this device's token
}

export interface SyncChange {
  kind: RecordKind;
  id: string;          // stable ID. Events: `${sessionId}:${seq}`
  version: number;
  deleted?: boolean;
  data: Record<string, unknown>; // never paths, secrets or raw output
}

export interface PushRequest { changes: SyncChange[] }
export interface PushResult {
  accepted: string[];
  rejected: { id: string; reason: "too_large" | "forbidden_field" | "illegal_move" | "stale" }[];
}

export interface PullRequest { cursor: string | null }
export interface PullResult {
  changes: SyncChange[];
  nextCursor: string;
  hasMore: boolean;
}

export interface CloudSync {
  push(req: PushRequest): Promise<PushResult>;
  pull(req: PullRequest): Promise<PullResult>;
}
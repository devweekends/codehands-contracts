import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SESSION_TRANSITIONS, TABLE_WRITERS } from "../src/index.js";

const sql = readFileSync(new URL("../sql/001_init.sql", import.meta.url), "utf8");

describe("local db contract", () => {
  it("has a SQL table for every table in TABLE_WRITERS", () => {
    for (const table of Object.keys(TABLE_WRITERS)) {
      expect(sql).toContain(`create table if not exists ${table} (`);
    }
  });

  it("has no SQL table missing from TABLE_WRITERS", () => {
    const found = [...sql.matchAll(/create table if not exists (\w+) \(/g)].map((m) => m[1]);
    expect(found.sort()).toEqual(Object.keys(TABLE_WRITERS).sort());
  });

  it("allows exactly the session statuses from session.ts", () => {
    const block = sql.match(/status\s+text not null default 'queued'\s+check \(status in \(([^)]*)\)/s);
    expect(block).not.toBeNull();
    const inSql = [...block![1].matchAll(/'(\w+)'/g)].map((m) => m[1]);
    expect(inSql.sort()).toEqual(Object.keys(SESSION_TRANSITIONS).sort());
  });
});
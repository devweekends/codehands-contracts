# codehands-contracts

The shapes every Code Hands AI repo agrees on: session rows, session states, runner events and the `Runner` interface.

| File | What | Consumed by |
| --- | --- | --- |
| `src/session.ts` | `Session`, `Command`, `SessionStatus`, the legal state moves | api, cli, desktop, web, runner |
| `src/runner.ts` | `RunnerEvent`, event names, `StartOptions`, `Runner` | cli (daemon), runner |

**Status:** proposed Mon Oct 19, frozen Fri Oct 23, 2026.

## Using it from another repo

```jsonc
// while developing, with both repos cloned side by side
"@codehands/contracts": "file:../codehands-contracts"
// after it is pushed, pin a tag
"@codehands/contracts": "github:imtahirabatool/codehands-contracts#v0.1.0"
```

## Changing it

1. Open a PR here. Every consuming repo's owner approves it.
2. Bump the version (minor for additions, major for renames or removals) and tag it.
3. Update the matching stand-in (the runner's fake runner, the fake daemon) in the same week.

```bash
pnpm install
pnpm build
pnpm test
```

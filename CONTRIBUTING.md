# Contributing to Postal

Postal is maintained by [Fiza Amjad](https://github.com/fizaamjad897). Small, focused pull requests are welcome. Discuss substantial protocol, storage, or deployment changes in an issue first.

## Local setup

Use Node.js 22 and npm. Follow the [quick start](README.md#quick-start) for MongoDB, Redis, and Mailpit. Copy `.env.example` to `.env`; never commit credentials or real mailbox data. Run `npm ci` from the repository root so all workspaces use the same lockfile.

## Before opening a pull request

```sh
npm run docs:check
npm run typecheck
npm run lint
npm test
npm run build
```

Tests start their own MongoDB instance and loopback SMTP sinks; the initial run downloads MongoDB 7.0.14. No production database or external mail recipient is needed. Do not point tests at a live deployment. Docker changes must also pass the container build in CI.

Add regression coverage for changed behavior, especially SMTP reply handling, retry classification, mailbox ownership, and token rotation. Keep protocol tests against a local SMTP peer. Update documentation and environment examples when behavior or configuration changes. Commit `package-lock.json` with dependency changes.

## Review expectations

Explain the problem, resulting behavior, and verification in the pull request. Include screenshots for UI changes and sanitized transcripts for protocol changes. Do not include message bodies, tokens, credentials, or customer addresses. Avoid unrelated formatting and dependency upgrades. CI must pass before merge; the maintainer reviews compatibility and security implications.

## Reporting problems

Use the issue forms for reproducible bugs and proposals. Follow [SECURITY.md](SECURITY.md) for vulnerabilities and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community expectations. Contributions are licensed under the repository's [MIT license](LICENSE).

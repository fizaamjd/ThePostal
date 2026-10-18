# Security policy

## Supported code

Security fixes target the latest commit on `main`. Older snapshots are not maintained independently. Postal is a portfolio and educational mail server; no independent security audit or production service guarantee is claimed.

## Report privately

Use [GitHub private vulnerability reporting](https://github.com/fizaamjad897/ThePostal/security/advisories/new). Do not publish exploit details, credentials, message content, or personal data in issues. Include the affected commit, configuration with secrets removed, reproduction against local test accounts, impact, and any suggested mitigation. The maintainer will coordinate investigation and disclosure; no response-time SLA or bounty is offered.

## Deployment boundaries

- Keep MongoDB, Redis, and Mailpit private. Restrict infrastructure access and expose only the intended HTTPS and SMTP endpoints.
- Use a high-entropy `JWT_SECRET`, HTTPS, `COOKIE_SECURE=true`, and the same-origin frontend API proxy. Rotate credentials after suspected exposure.
- Use certificate verification for remote SMTP peers (`SMTP_TLS_REJECT_UNAUTHORIZED=true`); require STARTTLS when policy demands encryption. Local Mailpit settings are development examples.
- Do not run demo seeding on a deployment with real accounts. Demo passwords are public.
- Ingress accepts mail only for configured local mailboxes; it is not an unrestricted relay. Public registration and authenticated outbound delivery still require abuse controls before an internet-facing service is offered.
- SMTP transcripts, addresses, and telemetry can contain personal information. Restrict operator access, choose retention rules, and sanitize reports. Do not rely on logging redaction as a complete privacy boundary.
- Configure SPF, DKIM, DMARC, sender reputation, monitoring, backups, and provider limits for any real mail service; the application alone does not establish deliverability.

See the [deployment runbook](docs/DEPLOY.md) and [operations guide](docs/OPERATIONS.md).

## Dependency audit status — 18 October 2026

Compatible updates and the patched Nodemailer 10 MIME composer have been applied. The full audit still reports advisories in Next.js's PostCSS dependency and the ESLint configuration's `braces` dependency chain. These are not claimed resolved: npm proposes a major Next.js upgrade and a framework lint-config downgrade, respectively. A major framework migration needs its own compatibility review.

- [PostCSS source-map file disclosure](https://github.com/advisories/GHSA-r28c-9q8g-f849): relevant when processing attacker-controlled CSS or source maps. Build only trusted sources. This is a temporary exposure reduction, not a fix.
- [Braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): affects the development lint dependency chain. Avoid untrusted glob patterns; it is not used by the SMTP service.

Recheck with `npm audit` and `npm audit --omit=dev`; advisory counts can change. Dependabot and GitHub dependency alerts track follow-up updates. Do not use `npm audit fix --force` without reviewing its framework changes.

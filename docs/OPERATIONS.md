# Operating Postal

Read [DEPLOY.md](DEPLOY.md) for initial setup and [SECURITY.md](../SECURITY.md) before exposing a host.

## Before an update

Record the running Git commit and preserve the previous image. Back up MongoDB using your provider's snapshot facility or `mongodump`; test restoration in an isolated environment. Back up deployment configuration through your secret manager, not this repository. Redis queue persistence is not a substitute for a mailbox database backup.

Build and test the proposed commit before deploying. Review environment changes and dependency release notes. Apply database indexes using the migration command in the deployment guide; do not seed a real mailbox database.

## Health and delivery checks

- `/healthz`: process liveness. It does not prove mail delivery.
- `/readyz`: dependency readiness. Inspect the response as well as its HTTP status; a degraded queue can coexist with a healthy mailbox API.
- `/metrics`: restrict access at the proxy or network boundary if telemetry should be private.
- Send a test message to a controlled Mailpit instance or a recipient you own. Check its stored attempts, SMTP reply, and phase timings. An SMTP acceptance is not proof of final inbox placement.

Monitor queue depth, delivery failures, retry age, database storage, certificate expiry, and host resources. Keep logs and transcripts accessible only to authorized operators and define deletion periods. No built-in backup scheduler or incident response service is provided.

## Failure and recovery

If readiness fails, inspect database connectivity before restarting repeatedly. If delivery stalls, inspect Redis and worker logs, then examine individual SMTP reply codes. Avoid retrying permanent rejections blindly. The memory queue is non-durable; use Redis for persistent scheduling and inspect persisted deferred messages after an interruption.

For rollback, redeploy the previously tested commit/image with compatible configuration. Database changes may require separate recovery: verify schema/index compatibility before rollback, and restore backups only through an explicit recovery plan. Confirm readiness and perform another controlled send afterward.

Report software failures with sanitized evidence using the repository issue forms. Suspected compromise follows the private process in [SECURITY.md](../SECURITY.md).

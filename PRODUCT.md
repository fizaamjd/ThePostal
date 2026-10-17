# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, in order of priority:

1. **Recruiters and hiring managers** — non-specialists, skimming for one to two
   minutes, deciding whether the author can build. They will not understand SMTP
   and should not need to. The surface must look confidently designed and make
   the value legible fast.
2. **Engineers reviewing the work** — they click into a message, read the
   protocol trace, and judge whether the thing is real. Density and technical
   credibility matter to them more than approachability.

A third, incidental: a university assessor marking it against a Computer
Networks brief.

## Product Purpose

Postal is a self-hosted SMTP mail transfer agent with per-transaction network
telemetry. It sends real mail over the wire, receives mail on its own listener,
and records how long every phase of each SMTP transaction took.

It exists as a portfolio piece. Success is a reviewer concluding, within a
minute, that the author understands systems — and an engineer who digs in
finding that conclusion justified.

## Positioning

The mechanism a neighbouring product could not truthfully copy: the SMTP client
is hand-written on raw TCP/TLS sockets rather than delegated to a mail library,
specifically so that every command boundary is observable. Off-the-shelf clients
report one end-to-end duration; Postal times the DNS lookup, TCP connect, TLS
handshake, server greeting, EHLO, AUTH, envelope, DATA transfer and QUIT
separately, and renders them as a proportional waterfall.

The thesis the product argues: **one aggregate number cannot tell you which
phase was slow**, and a slow handshake and a slow payload are different problems
with different fixes.

## Operating Context

Opened in a browser on a laptop, in daylight, from a link in a CV or GitHub
profile. Usually a single short visit. The reviewer may also open the live API
documentation, the public GitHub repository, or send mail into the server with a
command-line client.

Deployed live: frontend on Vercel, API and MTA on an AWS EC2 instance in Mumbai,
MongoDB on Atlas, Redis alongside the app.

## Capabilities and Constraints

Confirmed functionality:

- Compose and submit mail; the API accepts it, queues it, and answers 202
- Mailbox with inbox / sent / archive folders, keyset pagination, full-text search,
  read and starred state
- Per-message delivery detail: every attempt, SMTP reply code and reply text,
  and a phase-by-phase network trace including the negotiated TLS protocol and
  cipher, peer host and payload throughput
- Telemetry dashboard: delivery rate, latency percentiles (p50/p95/p99), mean
  duration per SMTP phase, volume over time, queue depth, component health
- Live event stream over SSE; messages change state on screen without a reload
- Inbound SMTP daemon on port 2525, which refuses to relay for foreign domains
- Retry semantics: 5xx bounces immediately, 4xx defers with exponential backoff
  and full jitter, up to a configured attempt ceiling

Terminology that must stay accurate: *queued, sending, delivered, deferred,
failed* for message state; *MTA*, *envelope*, *relay*, *MX*, *STARTTLS*;
reply codes written as the server returns them (`250 2.0.0 Ok`).

Constraints:

- Mail is relayed into a local Mailpit sink, so nothing reaches a real inbox.
  Demonstration data is real in the sense that the SMTP transactions genuinely
  happened; the recipients are fictional.
- No DKIM, SPF or DMARC; no TLS on the inbound listener
- Next.js Pages Router with MUI as the component layer — the design system is
  expressed through the MUI theme rather than a separate CSS framework
- Seeded demo account: `demo@postal.local`

## Brand Commitments

None inherited. The previous interface (purple-to-blue gradients, Inter, large
radii, soft shadows) is explicitly rejected as generic and is an anti-reference,
not authority.

Stated preference: the interface should feel designed and substantial rather
than plain, and should carry a theme applied consistently across every screen.

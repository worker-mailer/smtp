# SMTP overview

`@workermailer/smtp` is the Worker Mailer package for direct SMTP delivery from Cloudflare Workers. It uses Cloudflare TCP sockets instead of a separate Node mail relay, so the same Worker that handles your request can also talk to the SMTP server.

## Why this package exists

Traditional SMTP libraries expect a long-lived Node.js runtime and access to platform sockets that do not map cleanly to Cloudflare Workers. This package keeps the API small and Worker-native while still covering the parts teams actually need in production.

## What ships today

- Direct SMTP connections from Cloudflare Workers using `cloudflare:sockets`
- TypeScript-first transport and message types
- Plain text and HTML bodies
- Attachments and CID inline images
- DSN configuration for delivery notifications
- Lifecycle hooks for connection, success, failure, and close
- Queue helpers for Cloudflare Queues
- EmDash sandbox bundle in `emdash-plugin/`

## When to choose SMTP

Choose SMTP when you:

- already have a provider or mailbox service that exposes SMTP credentials
- need DSN knobs or lower-level transport control
- want to keep the same message model across Worker-first infrastructure

Choose `@workermailer/resend` when your team prefers the Resend HTTP API and a lighter operational model.

## Package shape

The package exposes two main entry points:

- `@workermailer/smtp`: the mailer, types, error classes, and utilities
- `@workermailer/smtp/queue`: helpers for enqueuing and processing queued sends

## Production notes

- Use Cloudflare Workers compatibility flags that enable Node compatibility.
- Keep credentials in Worker secrets or your deployment platform secret store.
- Prefer queue-based delivery for workflows that should not block user-facing responses.

## Where to go next

- Start with [Installation](/docs/smtp/installation)
- Send a first message in [Quickstart](/docs/smtp/quickstart)
- Move background sends to [Queues](/docs/smtp/queues)

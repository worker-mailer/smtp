# SMTP API reference

## Main exports

```ts
import { WorkerMailer, LogLevel } from '@workermailer/smtp';
import { createQueueHandler, enqueueEmail, enqueueEmails } from '@workermailer/smtp/queue';
```

## `WorkerMailer.connect(options)`

Creates a mailer instance backed by a live SMTP session.

### `WorkerMailerOptions`

| Field | Type | Notes |
| --- | --- | --- |
| `host` | `string` | SMTP hostname |
| `port` | `number` | SMTP port, usually `587` or `465` |
| `secure` | `boolean` | Force immediate TLS |
| `startTls` | `boolean` | Upgrade to TLS when the server supports it |
| `credentials` | `{ username: string; password: string }` | SMTP auth credentials |
| `authType` | `'plain' \| 'login' \| 'cram-md5' \| AuthType[]` | Accepted auth modes |
| `logLevel` | `LogLevel` | Mailer logging verbosity |
| `socketTimeoutMs` | `number` | Socket timeout |
| `responseTimeoutMs` | `number` | SMTP response timeout |
| `dsn` | object | Default DSN options for outbound mail |
| `hooks` | `WorkerMailerHooks` | Delivery lifecycle callbacks |

## `mailer.send(email)`

Queues a message for delivery over the current connection and resolves when the send completes.

### `EmailOptions`

| Field | Type | Notes |
| --- | --- | --- |
| `from` | `string \| User` | Sender identity |
| `to` | `string \| string[] \| User \| User[]` | Required recipients |
| `reply` | `string \| User` | Optional reply-to |
| `cc` | `string \| string[] \| User \| User[]` | Carbon copy recipients |
| `bcc` | `string \| string[] \| User \| User[]` | Blind carbon copy recipients |
| `subject` | `string` | Message subject |
| `text` | `string` | Plain text body |
| `html` | `string` | HTML body |
| `headers` | `Record<string, string>` | Custom SMTP headers |
| `attachments` | `Attachment[]` | Files or CID inline assets |
| `dsnOverride` | object | Per-message DSN override |

At least one of `text` or `html` is required.

## `WorkerMailer.send(options, email)`

Convenience helper for a single send without manually keeping the connection instance.

## `WorkerMailerHooks`

| Hook | Signature | Purpose |
| --- | --- | --- |
| `onConnect` | `() => void \| Promise<void>` | Runs after the SMTP session is ready |
| `onSent` | `(email, response) => void \| Promise<void>` | Runs after a successful send |
| `onError` | `(email, error) => void \| Promise<void>` | Runs when a send fails |
| `onClose` | `(error?) => void \| Promise<void>` | Runs when the connection closes |

## Queue entry point

The queue module exports:

- `createQueueHandler()`
- `enqueueEmail()`
- `enqueueEmails()`

See [Queues](/docs/smtp/queues) for production examples.

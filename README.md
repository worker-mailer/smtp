# Worker Mailer

[English](./README.md) | [Português](./README_pt-BR.md)

[![npm version](https://badge.fury.io/js/@ribassu%2Fworker-mailer.svg)](https://badge.fury.io/js/@ribassu%2Fworker-mailer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Worker Mailer is an SMTP client that runs on Cloudflare Workers. It leverages [Cloudflare TCP Sockets](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/) and doesn't rely on any other dependencies.

## Features

- 🚀 Completely built on the Cloudflare Workers runtime with no other dependencies
- 📝 Full TypeScript type support
- 📧 Supports sending plain text and HTML emails with attachments
- �️ Inline image attachments with Content-ID (CID) support
- 🔒 Supports multiple SMTP authentication methods: `plain`, `login`, and `CRAM-MD5`
- ✅ Email address validation (RFC 5322 compliant)
- 🎯 Custom error classes for better error handling
- 🪝 Lifecycle hooks for monitoring email operations
- 📅 DSN support
- 📬 Optional Cloudflare Queues integration for async email processing

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Inline Images (CID)](#inline-images-cid)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Error Handling](#error-handling)
- [Cloudflare Queues Integration](#cloudflare-queues-integration)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

## Installation

```shell
npm i @ribassu/worker-mailer
```

## Quick Start

1. Configure your `wrangler.toml`:

```toml
compatibility_flags = ["nodejs_compat"]
# or compatibility_flags = ["nodejs_compat_v2"]
```

2. Use in your code:

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'

// Connect to SMTP server
const mailer = await WorkerMailer.connect({
  credentials: {
    username: 'bob@acme.com',
    password: 'password',
  },
  authType: 'plain',
  host: 'smtp.acme.com',
  port: 587,
  secure: true,
})

// Send email
await mailer.send({
  from: { name: 'Bob', email: 'bob@acme.com' },
  to: { name: 'Alice', email: 'alice@acme.com' },
  subject: 'Hello from Worker Mailer',
  text: 'This is a plain text message',
  html: '<h1>Hello</h1><p>This is an HTML message</p>',
})
```

3. Using with modern JavaScript frameworks (Next.js, Nuxt, SvelteKit, etc.)

When working with frameworks that use Node.js as their development runtime, you'll need to handle the fact that Cloudflare Workers-specific APIs (like `cloudflare:sockets`) aren't available during local development.

The recommended approach is to use conditional dynamic imports. Here's an example for Nuxt.js:

```typescript
export default defineEventHandler(async event => {
  // Check if running in development environment
  if (import.meta.dev) {
    // Development: Use nodemailer (or any Node.js compatible email library)
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport()
    return await transporter.sendMail()
  } else {
    // Production: Use worker-mailer in Cloudflare Workers environment
    const { WorkerMailer } = await import('@ribassu/worker-mailer')
    const mailer = await WorkerMailer.connect()
    return await mailer.send()
  }
})
```

This pattern ensures your application works seamlessly in both development and production environments.

## API Reference

### WorkerMailer.connect(options)

Creates a new SMTP connection.

```typescript
type WorkerMailerOptions = {
  host: string // SMTP server hostname
  port: number // SMTP server port (usually 587 or 465)
  secure?: boolean // Use TLS (default: false)
  startTls?: boolean // Upgrade to TLS if SMTP server supports (default: true)
  credentials?: {
    // SMTP authentication credentials
    username: string
    password: string
  }
  authType?:
    | 'plain'
    | 'login'
    | 'cram-md5'
    | Array<'plain' | 'login' | 'cram-md5'>
  logLevel?: LogLevel // Logging level (default: LogLevel.INFO)
  socketTimeoutMs?: number // Socket timeout in milliseconds
  responseTimeoutMs?: number // Server response timeout in milliseconds
  hooks?: WorkerMailerHooks // Lifecycle hooks for monitoring
  dsn?: {
    RET?: {
      HEADERS?: boolean
      FULL?: boolean
    }
    NOTIFY?: {
      DELAY?: boolean
      FAILURE?: boolean
      SUCCESS?: boolean
    }
  }
}
```

### mailer.send(options)

Sends an email.

```typescript
type EmailOptions = {
  from:
    | string
    | {
        // Sender's email
        name?: string
        email: string
      }
  to:
    | string
    | string[]
    | {
        // Recipients (TO)
        name?: string
        email: string
      }
    | Array<{ name?: string; email: string }>
  reply?:
    | string
    | {
        // Reply-To address
        name?: string
        email: string
      }
  cc?:
    | string
    | string[]
    | {
        // Carbon Copy recipients
        name?: string
        email: string
      }
    | Array<{ name?: string; email: string }>
  bcc?:
    | string
    | string[]
    | {
        // Blind Carbon Copy recipients
        name?: string
        email: string
      }
    | Array<{ name?: string; email: string }>
  subject: string // Email subject
  text?: string // Plain text content
  html?: string // HTML content
  headers?: Record<string, string> // Custom email headers
  attachments?: Attachment[] // Attachments
  dsnOverride?: {
    // Overrides dsn defined in WorkerMailer
    envelopeId?: string | undefined
    RET?: {
      HEADERS?: boolean
      FULL?: boolean
    }
    NOTIFY?: {
      DELAY?: boolean
      FAILURE?: boolean
      SUCCESS?: boolean
    }
  }
}

type Attachment = {
  filename: string
  content: string // Base64-encoded content
  mimeType?: string // MIME type (auto-detected if not set)
  cid?: string // Content-ID for inline images
  inline?: boolean // If true, attachment will be inline
}
```

### Static Method: WorkerMailer.send()

Send a one-off email without maintaining the connection.

```typescript
await WorkerMailer.send(
  {
    // WorkerMailerOptions
    host: 'smtp.acme.com',
    port: 587,
    credentials: {
      username: 'user',
      password: 'pass',
    },
  },
  {
    // EmailOptions
    from: 'sender@acme.com',
    to: 'recipient@acme.com',
    subject: 'Test',
    text: 'Hello',
    attachments: [
      {
        filename: 'test.txt',
        content: 'SGVsbG8gV29ybGQ=', // base64-encoded string for "Hello World"
        mimeType: 'text/plain',
      },
    ],
  },
)
```

## Inline Images (CID)

You can embed images directly in HTML emails using Content-ID (CID):

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'

const mailer = await WorkerMailer.connect({
  host: 'smtp.acme.com',
  port: 587,
  credentials: { username: 'user', password: 'pass' },
})

await mailer.send({
  from: 'sender@acme.com',
  to: 'recipient@acme.com',
  subject: 'Email with embedded image',
  html: `
    <h1>Hello!</h1>
    <p>Here's our logo:</p>
    <img src="cid:company-logo" alt="Company Logo">
  `,
  attachments: [
    {
      filename: 'logo.png',
      content: logoBase64, // Base64-encoded image
      mimeType: 'image/png',
      cid: 'company-logo', // Referenced in HTML as cid:company-logo
      inline: true,
    },
  ],
})
```

## Lifecycle Hooks

Monitor email operations with lifecycle hooks:

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'

const mailer = await WorkerMailer.connect({
  host: 'smtp.acme.com',
  port: 587,
  credentials: { username: 'user', password: 'pass' },
  hooks: {
    onConnect: () => {
      console.log('Connected to SMTP server')
    },
    onSent: (email, response) => {
      console.log(`Email sent to ${email.to}:`, response)
    },
    onError: (email, error) => {
      console.error(`Failed to send email:`, error)
      // Send to error tracking service, etc.
    },
    onClose: error => {
      if (error) {
        console.error('Connection closed with error:', error)
      } else {
        console.log('Connection closed')
      }
    },
  },
})
```

## Error Handling

Worker Mailer provides custom error classes for better error handling:

```typescript
import {
  WorkerMailer,
  InvalidEmailError,
  SmtpAuthError,
  SmtpConnectionError,
  SmtpRecipientError,
  SmtpTimeoutError,
  InvalidContentError,
} from '@ribassu/worker-mailer'

try {
  const mailer = await WorkerMailer.connect({
    host: 'smtp.acme.com',
    port: 587,
    credentials: { username: 'user', password: 'wrong-password' },
  })

  await mailer.send({
    from: 'invalid-email', // This will throw InvalidEmailError
    to: 'recipient@acme.com',
    subject: 'Test',
    text: 'Hello',
  })
} catch (error) {
  if (error instanceof InvalidEmailError) {
    console.error('Invalid emails:', error.invalidEmails)
  } else if (error instanceof SmtpAuthError) {
    console.error('Authentication failed')
  } else if (error instanceof SmtpConnectionError) {
    console.error('Could not connect to SMTP server')
  } else if (error instanceof SmtpRecipientError) {
    console.error('Recipient rejected:', error.recipient)
  } else if (error instanceof SmtpTimeoutError) {
    console.error('Operation timed out')
  } else if (error instanceof InvalidContentError) {
    console.error('Invalid email content (missing text or html)')
  }
}
```

## Cloudflare Queues Integration

For high-volume email sending, you can use Cloudflare Queues for async processing:

### Setup

1. Add a Queue binding in `wrangler.toml`:

```toml
[[queues.producers]]
queue = "email-queue"
binding = "EMAIL_QUEUE"

[[queues.consumers]]
queue = "email-queue"
max_batch_size = 10
max_retries = 3
```

2. Create your worker with queue handler:

```typescript
import { WorkerMailer } from '@ribassu/worker-mailer'
import {
  createQueueHandler,
  enqueueEmail,
  type QueueEmailMessage,
} from '@ribassu/worker-mailer/queue'

interface Env {
  EMAIL_QUEUE: Queue<QueueEmailMessage>
}

export default {
  // Handle HTTP requests - enqueue emails
  async fetch(request: Request, env: Env): Promise<Response> {
    await enqueueEmail(env.EMAIL_QUEUE, {
      mailerOptions: {
        host: 'smtp.acme.com',
        port: 587,
        credentials: { username: 'user', password: 'pass' },
        authType: 'plain',
      },
      emailOptions: {
        from: 'sender@acme.com',
        to: 'recipient@acme.com',
        subject: 'Hello from Queue',
        text: 'This email was sent via Cloudflare Queues!',
      },
    })

    return new Response('Email queued successfully')
  },

  // Process queued emails
  async queue(batch: MessageBatch<QueueEmailMessage>, env: Env): Promise<void> {
    const handler = createQueueHandler({
      onSuccess: result => console.log('Email sent:', result.emailOptions.to),
      onError: result => console.error('Failed:', result.error),
    })

    await handler(batch)
  },
}
```

### Queue Helper Functions

```typescript
import {
  enqueueEmail,
  enqueueEmails,
  type QueueEmailMessage,
} from '@ribassu/worker-mailer/queue'

// Enqueue a single email
await enqueueEmail(env.EMAIL_QUEUE, {
  mailerOptions: { host: 'smtp.acme.com', port: 587 /* ... */ },
  emailOptions: {
    from: 'a@b.com',
    to: 'c@d.com',
    subject: 'Hi',
    text: 'Hello',
  },
})

// Enqueue multiple emails at once
await enqueueEmails(env.EMAIL_QUEUE, [
  {
    mailerOptions: {
      /* ... */
    },
    emailOptions: {
      /* ... */
    },
  },
  {
    mailerOptions: {
      /* ... */
    },
    emailOptions: {
      /* ... */
    },
  },
])
```

## Limitations

- **Port Restrictions:** Cloudflare Workers cannot make outbound connections on port 25. You won't be able to send emails via port 25, but common ports like 587 and 465 are supported.
- **Connection Limits:** Each Worker instance has a limit on the number of concurrent TCP connections. Make sure to properly close connections when done.

## Contributing

### Development Workflow

> For major changes, please open an issue first to discuss what you would like to change.

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Create a new branch for your feature from `develop`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Make your changes and make sure all tests pass
5. Update README.md & changelog `bun changeset` if needed
6. Push your changes to your fork and create a pull request from your branch to `develop`

### Testing

1. Unit Tests:
   ```bash
   bun test
   ```
2. Integration Tests:
   ```bash
   bunx wrangler dev ./test/worker.ts
   ```
   Then, send a POST request to `http://127.0.0.1:8787` with the following JSON body:
   ```json
   {
     "config": {
       "credentials": {
         "username": "xxx@xx.com",
         "password": "xxxx"
       },
       "authType": "plain",
       "host": "smtp.acme.com",
       "port": 587,
       "secure": false,
       "startTls": true
     },
     "email": {
       "from": "xxx@xx.com",
       "to": "yyy@yy.com",
       "subject": "Test Email",
       "text": "Hello World"
     }
   }
   ```

### Reporting Issues

When reporting issues, please include:

- Version of worker-mailer you're using
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Any relevant code snippets or error messages

## License

This project is licensed under the MIT License.

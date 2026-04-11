# Hooks and errors

## Lifecycle hooks

Hooks make it easier to trace delivery outcomes and wire custom observability.

```ts
import { WorkerMailer } from '@workermailer/smtp';

const mailer = await WorkerMailer.connect({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  credentials: {
    username: env.SMTP_USERNAME,
    password: env.SMTP_PASSWORD
  },
  hooks: {
    onConnect: () => console.log('SMTP session ready'),
    onSent: (email, response) => console.log('Sent', email.subject, response),
    onError: (email, error) => console.error('Send failed', email?.subject, error),
    onClose: (error) => console.log('Connection closed', error)
  }
});
```

## Error classes

The package exposes custom SMTP errors so failures are easier to classify in code and logs.

- `InvalidEmailError`
- `InvalidContentError`
- `SmtpAuthError`
- `SmtpConnectionError`
- `SmtpRecipientError`
- `SmtpTimeoutError`

## What to catch

Use error classes when you need different recovery strategies.

```ts
try {
  await WorkerMailer.send(mailerOptions, emailOptions);
} catch (error) {
  if (error instanceof SmtpAuthError) {
    // rotate credentials, alert, or fail fast
  }

  if (error instanceof SmtpTimeoutError) {
    // retry or move the message to a queue
  }

  throw error;
}
```

## Good operational defaults

- send via a queue for retriable workloads
- log the provider response in `onSent` when you need audit trails
- alert on repeated `SmtpAuthError` because credentials or policy likely changed
- keep socket and response timeouts explicit in latency-sensitive systems

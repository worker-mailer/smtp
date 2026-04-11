# SMTP quickstart

## Open a connection

Use `WorkerMailer.connect()` when you want to reuse a connection for one or more sends.

```ts
import { WorkerMailer } from '@workermailer/smtp';

const mailer = await WorkerMailer.connect({
  host: 'smtp.acme.com',
  port: 587,
  secure: false,
  startTls: true,
  authType: 'plain',
  credentials: {
    username: 'alerts@acme.com',
    password: 'super-secret'
  }
});
```

## Send a message

```ts
await mailer.send({
  from: { name: 'Acme Alerts', email: 'alerts@acme.com' },
  to: { name: 'Alice', email: 'alice@example.com' },
  subject: 'Deployment finished',
  text: 'Your deployment completed successfully.',
  html: '<p>Your deployment completed <strong>successfully</strong>.</p>'
});
```

## Close the connection

After the queued work is done, close the connection explicitly.

```ts
await mailer.close();
```

## One-off sends

If you do not need to keep the connection around, use the static helper:

```ts
await WorkerMailer.send(
  {
    host: 'smtp.acme.com',
    port: 587,
    credentials: {
      username: 'alerts@acme.com',
      password: 'super-secret'
    }
  },
  {
    from: 'alerts@acme.com',
    to: 'alice@example.com',
    subject: 'Hello',
    text: 'This is a one-off send.'
  }
);
```

## Recommended Worker pattern

A clean production flow is:

1. build mailer options from `env`
2. validate the payload before sending
3. use `WorkerMailer.send()` for simple one-off jobs
4. switch to queues when the send should not sit on the request path

## Useful next steps

- Add [Attachments and inline images](/docs/smtp/attachments-and-cid)
- Wire observability with [Hooks and errors](/docs/smtp/hooks-and-errors)
- Move send work to [Queues](/docs/smtp/queues)

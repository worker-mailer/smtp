# SMTP queues

## Why queues matter

Email delivery is a great candidate for Cloudflare Queues because user requests should not wait on upstream mail servers when they do not have to.

The queue helpers in `@workermailer/smtp/queue` keep the message contract small and let you centralize retries in the consumer.

## Define the producer payload

```ts
import { enqueueEmail } from '@workermailer/smtp/queue';

await enqueueEmail(env.EMAIL_QUEUE, {
  mailerOptions: {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    credentials: {
      username: env.SMTP_USERNAME,
      password: env.SMTP_PASSWORD
    },
    authType: 'plain'
  },
  emailOptions: {
    from: 'alerts@acme.com',
    to: 'alice@example.com',
    subject: 'Queued delivery',
    text: 'This send came from Cloudflare Queues.'
  }
});
```

## Process a queue batch

```ts
import { createQueueHandler } from '@workermailer/smtp/queue';

const handler = createQueueHandler({
  onSuccess: (result) => console.log('Delivered', result.emailOptions.subject),
  onError: (result) => console.error('Failed', result.error)
});

export default {
  async queue(batch: MessageBatch<any>) {
    return handler(batch);
  }
};
```

## Batch helper

Use `enqueueEmails()` when you already have a list of outbound messages.

```ts
await enqueueEmails(env.EMAIL_QUEUE, messages);
```

## Retry behavior

The queue handler acknowledges successful messages and calls `message.retry()` on failures. That means your Queue retry policy becomes the delivery backoff policy.

## Recommended split

- request handler: validate payload and enqueue
- queue consumer: talk to SMTP and own retry behavior
- observability: use `onSuccess` and `onError` callbacks for logging or metrics

# SMTP installation

## Install the package

Use Bun first when possible:

```bash
bun add @workermailer/smtp
```

If your project still uses npm:

```bash
npm install @workermailer/smtp
```

## Enable Worker compatibility

`@workermailer/smtp` depends on Cloudflare Worker runtime capabilities. Make sure your Worker enables Node compatibility in `wrangler.jsonc` or `wrangler.toml`.

```toml
compatibility_flags = ["nodejs_compat"]
```

If your project uses the newer compatibility bundle, `nodejs_compat_v2` also works.

## Store credentials safely

Do not hardcode SMTP credentials in source files. Use secrets instead.

```bash
wrangler secret put SMTP_USERNAME
wrangler secret put SMTP_PASSWORD
```

Then read them from your Worker `env` object when building the mailer options.

## Local development strategy

Local dev servers for frameworks like Next.js, Nuxt, and SvelteKit usually run on Node.js, not inside the Cloudflare Worker runtime. That means `cloudflare:sockets` is not available during normal dev mode.

The clean pattern is:

- use a Node-compatible mailer locally for previews or fake sends
- dynamically import `@workermailer/smtp` only in the real Worker environment

```ts
export async function sendTransactionalEmail(env: Env) {
  if (import.meta.env?.DEV) {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport();
    return transporter.sendMail({
      to: 'dev@example.com',
      subject: 'Preview send',
      text: 'Local preview'
    });
  }

  const { WorkerMailer } = await import('@workermailer/smtp');
  const mailer = await WorkerMailer.connect({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    credentials: {
      username: env.SMTP_USERNAME,
      password: env.SMTP_PASSWORD
    }
  });

  await mailer.send({
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Hello from Workers',
    text: 'Production send'
  });
}
```

## Verify your environment

Before moving to production, verify:

- the Worker runtime can reach your SMTP host and port
- your provider allows the auth method you plan to use
- your sender domain and mailbox credentials are already valid
- any queue consumer has access to the same mailer secrets

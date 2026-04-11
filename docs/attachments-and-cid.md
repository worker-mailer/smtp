# Attachments and inline images

## Regular attachments

Attachments use base64 content and an optional MIME type.

```ts
await mailer.send({
  from: 'alerts@acme.com',
  to: 'alice@example.com',
  subject: 'Monthly invoice',
  text: 'Invoice attached.',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: pdfBase64,
      mimeType: 'application/pdf'
    }
  ]
});
```

## Inline images with CID

If an attachment includes a `cid`, the package treats it as an inline asset and builds the MIME structure accordingly.

```ts
await mailer.send({
  from: 'alerts@acme.com',
  to: 'alice@example.com',
  subject: 'Welcome',
  html: '<h1>Welcome</h1><img src="cid:brand-logo" alt="Brand logo" />',
  text: 'Welcome to Acme.',
  attachments: [
    {
      filename: 'logo.png',
      content: logoBase64,
      mimeType: 'image/png',
      cid: 'brand-logo',
      inline: true
    }
  ]
});
```

## Message model notes

- `cid` is the signal that the attachment belongs in the inline section
- plain attachments stay in the regular mixed section
- both HTML and text bodies can coexist in the same message

## Practical tips

- Keep inline asset names stable and predictable
- Generate or store binary content as base64 before handing it to the mailer
- Set `mimeType` explicitly for assets that clients might mis-detect

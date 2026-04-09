# worker-mailer

## Unreleased

### Changes

- a6ab686: migrate project metadata to Bun and remove `pnpm-lock.yaml`

## 1.3.3

### Patch Changes

- 533e299: dependency update
- c2bd1f4: release v1.3.3

## 1.3.2

### Patch Changes

- 183ccf0: update library versions
- 0c4652e: add LICENSE file
- a0d7742: update LICENSE contents
- e0d0d2d: release v1.3.2

## 1.3.1

### Patch Changes

- 2681406: update documentation with new features
- bf60489: release v1.3.1

## 1.3.0

### Minor Changes

- 2224ada: add email validation with RFC 5322 compliant regex
- 2224ada: add custom error classes (InvalidEmailError, SmtpAuthError, SmtpConnectionError, SmtpRecipientError, SmtpTimeoutError, InvalidContentError)
- 2224ada: add support for inline attachments with Content-ID (CID) for embedding images in HTML emails
- 2224ada: add lifecycle hooks (onConnect, onSent, onError, onClose) for monitoring email operations
- 2224ada: add optional Cloudflare Queues integration for async email processing (`@ribassu/worker-mailer/queue`)
- b6ea3d8: fix duplicated `types` field in `package.json`
- 2068ddf: configure npm registry URL in publish workflow

## 1.2.12

### Patch Changes

- fe014cd: AAAAA
- b066e03: release v1.2.12

## 1.2.11

### Patch Changes

- 0d51c7f: And that?
- b706884: release v1.2.11

## 1.2.10

### Patch Changes

- daef139: add `--provenance`
- 1a6506c: release v1.2.10

## 1.2.9

### Patch Changes

- 731f782: If I have to run one more of these tests, I'll go crazy!
- 189976c: release v1.2.9

## 1.2.8

### Patch Changes

- 38ea0d9: Use Bun
- e91d939: release v1.2.8

## 1.2.7

### Patch Changes

- b8fe749: Fiix
- b953bed: Fix?
- 941d986: release v1.2.7

## 1.2.6

### Patch Changes

- 53695f0: Fix?
- 74ce7d4: release v1.2.6

## 1.2.5

### Patch Changes

- 8bc025e: fix
- 5d283df: release v1.2.5

## 1.2.4

### Patch Changes

- c9c9953: Fix publish npm
- cc7895b: Changing the npm version pointer
- e2f583a: release v1.2.4

## 1.2.3

### Patch Changes

- 6ccdd9a: Up GitHub Actions
- 7ad0b82: Updated package name
- 2ebaf1b: release v1.2.3

## 1.2.2

### Patch Changes

- bbec754: Init
- 9c3fa7b: release v1.2.2

## 1.2.1

### Patch Changes

- 18cd709: fix: implement SMTP dot-stuffing (rfc 5321)

## 1.2.0

### Minor Changes

- f3a7fb2: Implement quoted-printable encoding

## 1.1.5

### Patch Changes

- 02cc185: fix: Email headers override

## 1.1.4

### Patch Changes

- 159934d: fix: Mime boundary length too long.

## 1.1.3

### Patch Changes

- 55259f1: fix: Socket close timeout by ignoring promise result
- c385ba1: fix #23: some servers replied 550 MIME boundary length exceeded (see RFC 2046) to messages that were too long

## 1.1.2

### Patch Changes

- cb77d2b: fix: Socket close timeout by ignoring promise result
- 90d0631: fix #23: some servers replied 550 MIME boundary length exceeded (see RFC 2046) to messages that were too long

## 1.1.1

### Patch Changes

- e14a156: fix: Add missing space before NOTIFY=NEVER

## 1.1.0

### Minor Changes

- 15a2961: Add DSN & attachment features
- 15a2961: Add startTls options(default: true), upgrade to TLS if SMTP server supported.

## 1.0.1

### Patch Changes

- 248bb4a: Export LogLevel Enum while packaging

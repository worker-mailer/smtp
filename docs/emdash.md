# SMTP EmDash bundle

## What lives in this repo

The SMTP repository includes an `emdash-plugin/` directory that builds a sandbox-compatible EmDash publish bundle.

## Useful commands

Build the sandbox entry:

```bash
bunx tsup --config emdash-plugin/tsup.config.ts
```

Bundle the plugin for submission:

```bash
bunx emdash plugin bundle --dir emdash-plugin
```

## What the bundle contains

The EmDash bundle is expected to include the publish artifacts required by the marketplace, including a `manifest.json` and sandbox backend output.

## When to use it

Use the EmDash bundle when you want the SMTP provider exposed inside EmDash as a sandbox backend instead of wiring the package manually in a separate integration layer.

## Related package docs

- Use the normal library API from [Quickstart](/docs/smtp/quickstart)
- Review the Worker-facing transport options in [API reference](/docs/smtp/api-reference)

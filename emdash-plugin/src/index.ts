import { definePlugin } from "emdash";

export default definePlugin({
  id: "@workermailer/smtp",
  version: "0.1.4",
  name: "Worker Mailer (SMTP)",
  description: "SMTP transport provider for EmDash using Cloudflare Workers sockets.",
  capabilities: ["email:provide"],
  admin: {
    settingsSchema: {
      host: { type: "text", label: "SMTP Host", required: true },
      port: { type: "number", label: "SMTP Port", required: true },
      secure: { type: "boolean", label: "Use TLS (SMTPS)", default: true },
      startTls: { type: "boolean", label: "Upgrade via STARTTLS", default: true },
      username: { type: "text", label: "SMTP Username" },
      password: { type: "secret", label: "SMTP Password" },
      authType: {
        type: "select",
        label: "Auth Type",
        default: "plain",
        options: [
          { label: "Plain", value: "plain" },
          { label: "Login", value: "login" },
          { label: "CRAM-MD5", value: "cram-md5" }
        ]
      }
    }
  },
  hooks: {
    "email:deliver": async () => {
      // Handled by sandbox entry in backend.js.
    }
  }
});

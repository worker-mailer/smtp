import { WorkerMailer } from "../../src/mailer";
import type { EmailOptions } from "../../src/email";

type PluginSettings = {
  host: string;
  port: number;
  secure?: boolean;
  startTls?: boolean;
  username?: string;
  password?: string;
  authType?: "plain" | "login" | "cram-md5";
};

type EmailLike = {
  from?: string | { name?: string; email: string };
  to?: string | string[] | { name?: string; email: string } | Array<{ name?: string; email: string }>;
  cc?: string | string[] | { name?: string; email: string } | Array<{ name?: string; email: string }>;
  bcc?: string | string[] | { name?: string; email: string } | Array<{ name?: string; email: string }>;
  replyTo?: string | { name?: string; email: string };
  subject?: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  attachments?: EmailOptions["attachments"];
};

async function readSettings(ctx: any): Promise<PluginSettings> {
  if (ctx?.settings && typeof ctx.settings === "object") {
    return ctx.settings as PluginSettings;
  }
  if (ctx?.kv?.get) {
    const raw = await ctx.kv.get("settings");
    if (raw && typeof raw === "string") {
      try {
        return JSON.parse(raw) as PluginSettings;
      } catch {
        // fall through
      }
    }
    if (raw && typeof raw === "object") {
      return raw as PluginSettings;
    }
  }
  throw new Error("Plugin settings not found. Configure SMTP settings in the plugin admin page.");
}

function normalizeEmail(input: EmailLike): EmailOptions {
  const from = input.from ?? "no-reply@example.com";
  const to = input.to ?? [];

  return {
    from,
    to,
    cc: input.cc,
    bcc: input.bcc,
    reply: input.replyTo,
    subject: input.subject ?? "",
    text: input.text,
    html: input.html,
    headers: input.headers,
    attachments: input.attachments
  };
}

export const hooks = {
  "email:deliver": async (event: any, ctx: any) => {
    const settings = await readSettings(ctx);
    if (!settings.host || !settings.port) {
      throw new Error("SMTP settings are missing required host/port.");
    }

    const message: EmailLike =
      event?.message ??
      event?.email ??
      event?.payload ??
      event ??
      {};

    const mailerOptions = {
      host: settings.host,
      port: settings.port,
      secure: settings.secure ?? true,
      startTls: settings.startTls ?? true,
      credentials: settings.username
        ? { username: settings.username, password: settings.password ?? "" }
        : undefined,
      authType: settings.authType
    };

    await WorkerMailer.send(mailerOptions, normalizeEmail(message));
  }
};

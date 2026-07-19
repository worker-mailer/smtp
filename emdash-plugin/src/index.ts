import { definePlugin } from 'emdash'

export default definePlugin({
  id: '@workermailer/smtp',
  version: '0.1.4',
  capabilities: ['email:provide'],
  admin: {
    settingsSchema: {
      host: { type: 'string', label: 'SMTP Host' },
      port: { type: 'number', label: 'SMTP Port' },
      secure: { type: 'boolean', label: 'Use TLS (SMTPS)', default: true },
      startTls: {
        type: 'boolean',
        label: 'Upgrade via STARTTLS',
        default: true,
      },
      username: { type: 'string', label: 'SMTP Username' },
      password: { type: 'secret', label: 'SMTP Password' },
      authType: {
        type: 'select',
        label: 'Auth Type',
        default: 'plain',
        options: [
          { label: 'Plain', value: 'plain' },
          { label: 'Login', value: 'login' },
          { label: 'CRAM-MD5', value: 'cram-md5' },
        ],
      },
    },
  },
  hooks: {
    'email:deliver': async () => {
      // Handled by sandbox entry in backend.js.
    },
  },
})

export * from './email'
export * from './mailer'
export * from './errors'
export { LogLevel } from './logger'
export { isValidEmail, validateEmails } from './utils'

// Queue integration is exported separately to keep it optional
// import { createQueueHandler, enqueueEmail } from '@ribassu/worker-mailer/queue'

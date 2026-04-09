import { WorkerMailer, WorkerMailerOptions } from './mailer'
import { EmailOptions } from './email'

/**
 * Message format for the email queue
 */
export type QueueEmailMessage = {
  mailerOptions: WorkerMailerOptions
  emailOptions: EmailOptions
}

/**
 * Result of processing a queued email
 */
export type QueueProcessResult = {
  success: boolean
  error?: string
  emailOptions: EmailOptions
}

/**
 * Creates a queue handler for processing emails asynchronously via Cloudflare Queues.
 *
 * This is useful for:
 * - Offloading email sending from the main request
 * - Handling email sending with automatic retries (via Queue retry policies)
 * - Processing emails in batches
 *
 * @example
 * ```typescript
 * // In your worker:
 * import { createQueueHandler } from '@ribassu/worker-mailer/queue'
 *
 * export default {
 *   async queue(batch, env, ctx) {
 *     const handler = createQueueHandler()
 *     const results = await handler(batch)
 *     console.log('Processed emails:', results)
 *   }
 * }
 *
 * // To enqueue an email:
 * await env.EMAIL_QUEUE.send({
 *   mailerOptions: {
 *     host: 'smtp.example.com',
 *     port: 587,
 *     credentials: { username: 'user', password: 'pass' },
 *     authType: 'plain'
 *   },
 *   emailOptions: {
 *     from: 'sender@example.com',
 *     to: 'recipient@example.com',
 *     subject: 'Hello',
 *     text: 'World'
 *   }
 * })
 * ```
 *
 * @param onSuccess - Optional callback when email is sent successfully
 * @param onError - Optional callback when email fails to send
 * @returns A queue handler function
 */
export function createQueueHandler(options?: {
  onSuccess?: (result: QueueProcessResult) => void | Promise<void>
  onError?: (result: QueueProcessResult) => void | Promise<void>
}) {
  return async function queueHandler(
    batch: MessageBatch<QueueEmailMessage>,
  ): Promise<QueueProcessResult[]> {
    const results: QueueProcessResult[] = []

    for (const message of batch.messages) {
      const { mailerOptions, emailOptions } = message.body
      const result: QueueProcessResult = {
        success: false,
        emailOptions,
      }

      try {
        await WorkerMailer.send(mailerOptions, emailOptions)
        result.success = true
        message.ack()
        await options?.onSuccess?.(result)
      } catch (error) {
        result.error = error instanceof Error ? error.message : String(error)
        message.retry()
        await options?.onError?.(result)
      }

      results.push(result)
    }

    return results
  }
}

/**
 * Helper to enqueue an email for async processing.
 *
 * @example
 * ```typescript
 * import { enqueueEmail } from '@ribassu/worker-mailer/queue'
 *
 * await enqueueEmail(env.EMAIL_QUEUE, {
 *   mailerOptions: { host: 'smtp.example.com', port: 587, ... },
 *   emailOptions: { from: '...', to: '...', subject: '...', text: '...' }
 * })
 * ```
 */
export async function enqueueEmail(
  queue: Queue<QueueEmailMessage>,
  message: QueueEmailMessage,
): Promise<void> {
  await queue.send(message)
}

/**
 * Helper to enqueue multiple emails for async processing.
 *
 * @example
 * ```typescript
 * import { enqueueEmails } from '@ribassu/worker-mailer/queue'
 *
 * await enqueueEmails(env.EMAIL_QUEUE, [
 *   { mailerOptions: {...}, emailOptions: {...} },
 *   { mailerOptions: {...}, emailOptions: {...} },
 * ])
 * ```
 */
export async function enqueueEmails(
  queue: Queue<QueueEmailMessage>,
  messages: QueueEmailMessage[],
): Promise<void> {
  await queue.sendBatch(messages.map(body => ({ body })))
}

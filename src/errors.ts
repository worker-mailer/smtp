/**
 * Base error class for WorkerMailer
 */
export class WorkerMailerError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'WorkerMailerError'
    this.code = code
  }
}

/**
 * Error thrown when email validation fails
 */
export class InvalidEmailError extends WorkerMailerError {
  public readonly invalidEmails: string[]

  constructor(message: string, invalidEmails: string[] = []) {
    super(message, 'INVALID_EMAIL')
    this.name = 'InvalidEmailError'
    this.invalidEmails = invalidEmails
  }
}

/**
 * Error thrown when SMTP authentication fails
 */
export class SmtpAuthError extends WorkerMailerError {
  constructor(message: string) {
    super(message, 'AUTH_FAILED')
    this.name = 'SmtpAuthError'
  }
}

/**
 * Error thrown when SMTP connection fails
 */
export class SmtpConnectionError extends WorkerMailerError {
  constructor(message: string) {
    super(message, 'CONNECTION_FAILED')
    this.name = 'SmtpConnectionError'
  }
}

/**
 * Error thrown when recipient is rejected by SMTP server
 */
export class SmtpRecipientError extends WorkerMailerError {
  public readonly recipient: string

  constructor(message: string, recipient: string) {
    super(message, 'RECIPIENT_REJECTED')
    this.name = 'SmtpRecipientError'
    this.recipient = recipient
  }
}

/**
 * Error thrown when SMTP operation times out
 */
export class SmtpTimeoutError extends WorkerMailerError {
  constructor(message: string) {
    super(message, 'TIMEOUT')
    this.name = 'SmtpTimeoutError'
  }
}

/**
 * Error thrown when email content is invalid
 */
export class InvalidContentError extends WorkerMailerError {
  constructor(message: string) {
    super(message, 'INVALID_CONTENT')
    this.name = 'InvalidContentError'
  }
}

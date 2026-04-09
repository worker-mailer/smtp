import { describe, it, expect } from 'vitest'
import {
  WorkerMailerError,
  InvalidEmailError,
  SmtpAuthError,
  SmtpConnectionError,
  SmtpRecipientError,
  SmtpTimeoutError,
  InvalidContentError,
} from '../../src/errors'

describe('WorkerMailerError', () => {
  it('should be an instance of Error', () => {
    const error = new WorkerMailerError('test')
    expect(error).toBeInstanceOf(Error)
  })

  it('should have correct name', () => {
    const error = new WorkerMailerError('test')
    expect(error.name).toBe('WorkerMailerError')
  })

  it('should store message', () => {
    const error = new WorkerMailerError('test message')
    expect(error.message).toBe('test message')
  })
})

describe('InvalidEmailError', () => {
  it('should be an instance of WorkerMailerError', () => {
    const error = new InvalidEmailError('invalid', ['bad@'])
    expect(error).toBeInstanceOf(WorkerMailerError)
  })

  it('should have correct name', () => {
    const error = new InvalidEmailError('invalid', ['bad@'])
    expect(error.name).toBe('InvalidEmailError')
  })

  it('should store invalid emails', () => {
    const invalidEmails = ['bad@', 'invalid', '@nope.com']
    const error = new InvalidEmailError('invalid', invalidEmails)
    expect(error.invalidEmails).toEqual(invalidEmails)
  })
})

describe('SmtpAuthError', () => {
  it('should be an instance of WorkerMailerError', () => {
    const error = new SmtpAuthError('auth failed')
    expect(error).toBeInstanceOf(WorkerMailerError)
  })

  it('should have correct name', () => {
    const error = new SmtpAuthError('auth failed')
    expect(error.name).toBe('SmtpAuthError')
  })
})

describe('SmtpConnectionError', () => {
  it('should be an instance of WorkerMailerError', () => {
    const error = new SmtpConnectionError('connection failed')
    expect(error).toBeInstanceOf(WorkerMailerError)
  })

  it('should have correct name', () => {
    const error = new SmtpConnectionError('connection failed')
    expect(error.name).toBe('SmtpConnectionError')
  })
})

describe('SmtpRecipientError', () => {
  it('should be an instance of WorkerMailerError', () => {
    const error = new SmtpRecipientError(
      'recipient rejected',
      'bad@example.com',
    )
    expect(error).toBeInstanceOf(WorkerMailerError)
  })

  it('should have correct name', () => {
    const error = new SmtpRecipientError(
      'recipient rejected',
      'bad@example.com',
    )
    expect(error.name).toBe('SmtpRecipientError')
  })

  it('should store recipient', () => {
    const error = new SmtpRecipientError(
      'recipient rejected',
      'bad@example.com',
    )
    expect(error.recipient).toBe('bad@example.com')
  })
})

describe('SmtpTimeoutError', () => {
  it('should be an instance of WorkerMailerError', () => {
    const error = new SmtpTimeoutError('timeout')
    expect(error).toBeInstanceOf(WorkerMailerError)
  })

  it('should have correct name', () => {
    const error = new SmtpTimeoutError('timeout')
    expect(error.name).toBe('SmtpTimeoutError')
  })
})

describe('InvalidContentError', () => {
  it('should be an instance of WorkerMailerError', () => {
    const error = new InvalidContentError('no content')
    expect(error).toBeInstanceOf(WorkerMailerError)
  })

  it('should have correct name', () => {
    const error = new InvalidContentError('no content')
    expect(error.name).toBe('InvalidContentError')
  })
})

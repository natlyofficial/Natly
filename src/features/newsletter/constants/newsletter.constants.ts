// ═══════════════════════════════════════════════════════════════
// NEWSLETTER CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const NEWSLETTER_CONSTANTS = {
  RATE_LIMIT: {
    MAX_REQUESTS: 3,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },
  TOKEN: {
    EXPIRY: '24h',
    LENGTH: 32,
  },
  EMAILS: {
    SENDERS: {
      CONFIRM: 'confirm@mail.natly.org',
      NEWSLETTER: 'newsletter@mail.natly.org',
      UNSUBSCRIBE: 'unsubscribe@mail.natly.org',
    },
    REPLY_TO: 'contact@natly.org',
  },
  VALIDATION: {
    EMAIL_REGEX: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    MAX_EMAIL_LENGTH: 255,
  },
  MESSAGES: {
    SUCCESS: {
      SUBSCRIBE_EN: 'Confirmation email sent! Check your inbox.',
      SUBSCRIBE_ES: '¡Email de confirmación enviado! Revisa tu bandeja.',
      CONFIRM_EN: 'Subscription confirmed successfully!',
      CONFIRM_ES: '¡Suscripción confirmada exitosamente!',
      UNSUBSCRIBE_EN: 'You have been unsubscribed.',
      UNSUBSCRIBE_ES: 'Te has dado de baja exitosamente.',
    },
    ERROR: {
      INVALID_EMAIL_EN: 'Please enter a valid email address.',
      INVALID_EMAIL_ES: 'Por favor ingresa un email válido.',
      RATE_LIMIT_EN: 'Too many requests. Please try again later.',
      RATE_LIMIT_ES: 'Demasiados intentos. Intenta más tarde.',
      GENERIC_EN: 'Something went wrong. Please try again.',
      GENERIC_ES: 'Algo salió mal. Intenta de nuevo.',
    },
  },
} as const;
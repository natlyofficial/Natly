import type { ApiResponse } from '../../shared/types/common.types';
import { NewsletterError } from './NewsletterError';

export function handleApiError(error: unknown): ApiResponse {
  // Known Newsletter Error
  if (error instanceof NewsletterError) {
    return {
      success: false,
      error: error.message,
    };
  }
  
  // Network/Fetch Error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
  
  // Generic Error
  if (error instanceof Error) {
    // Log to monitoring service in production
    if (import.meta.env.PROD) {
      console.error('[Error Handler]', {
        message: error.message,
        stack: error.stack,
      });
    }
    
    return {
      success: false,
      error: error.message || 'Something went wrong',
    };
  }
  
  // Unknown error
  console.error('[Error Handler] Unknown error:', error);
  
  return {
    success: false,
    error: 'An unexpected error occurred',
  };
}

export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(`[${context || 'Error'}]`, error);
  }
  
  // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(error, { tags: { context } });
  // }
}
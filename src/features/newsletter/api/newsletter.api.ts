// ═══════════════════════════════════════════════════════════════
// NEWSLETTER API CLIENT
// ═══════════════════════════════════════════════════════════════

import { ENV } from '@/config/env';
import { NewsletterError, ERROR_CODES } from '@/lib/errors/NewsletterError';
import type {
  SubscribeRequest,
  SubscribeResponse,
  ConfirmRequest,
  ConfirmResponse,
  UnsubscribeRequest,
  UnsubscribeResponse,
} from '../types/newsletter.types';

const API_BASE = `${ENV.API_URL}/.netlify/functions`;

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new NewsletterError(
        data.error || 'Request failed',
        data.code || ERROR_CODES.SERVER_ERROR,
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof NewsletterError) {
      throw error;
    }
    
    throw new NewsletterError(
      'Network error. Please check your connection.',
      ERROR_CODES.NETWORK_ERROR,
      0,
      error
    );
  }
}

export const newsletterApi = {
  /**
   * Subscribe to newsletter
   */
  subscribe: async (
    data: SubscribeRequest
  ): Promise<SubscribeResponse> => {
    return fetchApi<SubscribeResponse>('newsletter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Confirm subscription with JWT token
   */
  confirm: async (
    data: ConfirmRequest
  ): Promise<ConfirmResponse> => {
    return fetchApi<ConfirmResponse>('confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe: async (
    data: UnsubscribeRequest
  ): Promise<UnsubscribeResponse> => {
    return fetchApi<UnsubscribeResponse>('unsubscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
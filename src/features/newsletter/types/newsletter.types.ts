// ═══════════════════════════════════════════════════════════════
// NEWSLETTER TYPES
// ═══════════════════════════════════════════════════════════════

import type { BaseEntity, Language } from '../../../shared/types/common.types';

export type SubscriberStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'unsubscribed' 
  | 'bounced' 
  | 'archived' 
  | 'deleted';

export interface Subscriber extends BaseEntity {
  email: string;
  language: Language;
  status: SubscriberStatus;
  confirmation_token: string | null;
  unsubscribe_token: string | null;
  unsubscribe_reason: string | null;
  ip_address: string | null;
  source: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  archived_at: string | null;
  deleted_at: string | null;
  user_id: string | null;
}

export interface SubscribeRequest {
  email: string;
  language: Language;
  honeypot?: string;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
}

export interface ConfirmRequest {
  token: string;
}

export interface ConfirmResponse {
  success: boolean;
  message: string;
  alreadyConfirmed?: boolean;
}

export interface UnsubscribeRequest {
  token: string;
  reason?: string;
}

export interface UnsubscribeResponse {
  success: boolean;
  message: string;
  alreadyUnsubscribed?: boolean;
}
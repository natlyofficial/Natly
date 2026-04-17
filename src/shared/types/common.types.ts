// ═══════════════════════════════════════════════════════════════
// COMMON TYPES - Shared across features
// ═══════════════════════════════════════════════════════════════

export type Language = 'en' | 'es';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}
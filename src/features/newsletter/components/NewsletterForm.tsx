import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { newsletterApi } from '../api/newsletter.api';
import { handleApiError, logError } from '@/lib/errors/errorHandler';
import { NEWSLETTER_CONSTANTS } from '../constants/newsletter.constants';
import type { LoadingState } from '../../../shared/types/common.types';

export default function NewsletterForm() {
  const { t, i18n } = useTranslation('footer');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<LoadingState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Email validation regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email format before submitting
    if (!email.trim()) {
      setErrorMessage(t('newsletter.errorEmpty') || 'Email is required');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage(t('newsletter.errorInvalid') || 'Invalid email format');
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Get honeypot value
    const formData = new FormData(e.currentTarget);
    const honeypot = formData.get('honeypot') as string;

    try {
      await newsletterApi.subscribe({
        email,
        honeypot,
        language: i18n.language.substring(0, 2) as 'en' | 'es',
      });

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      logError(error, 'Newsletter Subscribe');
      const apiError = handleApiError(error);
      setErrorMessage(apiError.error || NEWSLETTER_CONSTANTS.MESSAGES.ERROR.GENERIC_EN);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:flex-1 sm:max-w-lg">
      <p className="text-white font-bold text-xl tracking-tight">
        {t('newsletter.title')}
      </p>
      <p className="text-white/55 text-sm text-center sm:text-left">
        {t('newsletter.subtitle')}
      </p>

      {status === 'success' ? (
        <p className="text-green-300 text-sm font-medium text-center sm:text-left">
          ✓ {t('newsletter.successMessage')}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full gap-2 mt-1" noValidate>
          {/* Honeypot */}
          <input
            type="text"
            name="honeypot"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            required
            disabled={status === 'loading'}
            className="newsletter-input flex-1 min-w-0"
          />
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="newsletter-btn"
          >
            {status === 'loading' ? t('newsletter.sending') : t('newsletter.button')}
          </button>
        </form>
      )}

      {/* ⬅Show error message for both 'error' status */}
      {status === 'error' && errorMessage && (
        <p className="text-red-300 text-xs">{errorMessage}</p>
      )}
    </div>
  );
}
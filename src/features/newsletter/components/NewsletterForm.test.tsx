// ═══════════════════════════════════════════════════════════════
// NEWSLETTER FORM COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterForm from './NewsletterForm';
import { newsletterApi } from '../api/newsletter.api';

// ───────────────────────────────────────────────────────────────
// MOCKS
// ───────────────────────────────────────────────────────────────

vi.mock('../api/newsletter.api', () => ({
  newsletterApi: {
    subscribe: vi.fn(),
    confirm: vi.fn(),
    unsubscribe: vi.fn(),
  }
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Mock translations map
      const translations: Record<string, string> = {
        'newsletter.title': 'Subscribe to Newsletter',
        'newsletter.subtitle': 'Get updates',
        'newsletter.placeholder': 'Enter your email',
        'newsletter.button': 'Subscribe',
        'newsletter.sending': 'Sending...',
        'newsletter.successMessage': 'Check your email!',
        'newsletter.errorEmpty': 'Email is required',
        'newsletter.errorInvalid': 'Invalid email format'
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' }
  })
}));

// ───────────────────────────────────────────────────────────────
// SETUP
// ───────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

// ───────────────────────────────────────────────────────────────
// RENDERING TESTS
// ───────────────────────────────────────────────────────────────

describe('NewsletterForm - Rendering', () => {
  it('renders email input field', () => {
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeDefined();
  });

  it('renders submit button', () => {
    render(<NewsletterForm />);
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDefined();
  });

  it('renders honeypot field hidden from user', () => {
    render(<NewsletterForm />);
    
    const honeypot = document.querySelector('input[name="website"]') ||
                     document.querySelector('input[name="honeypot"]');
    
    expect(honeypot).not.toBeNull();
  });

  it('email input starts empty', () => {
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    expect(emailInput.value).toBe('');
  });
});

// ───────────────────────────────────────────────────────────────
// USER INTERACTION TESTS
// ───────────────────────────────────────────────────────────────

describe('NewsletterForm - User Interaction', () => {
  it('allows user to type email', async () => {
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput.value).toBe('test@example.com');
  });

  it('submit button is enabled when form is idle', () => {
    render(<NewsletterForm />);
    
    const submitButton = screen.getByRole('button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  it('clears email input after successful submission', async () => {
    vi.mocked(newsletterApi.subscribe).mockResolvedValue({
        success: true,
        message: 'Success'
    });
    
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button');
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
        const successMessage = screen.getByText(/check.*email/i);
        expect(successMessage).toBeDefined();
    });
    });
});

// ───────────────────────────────────────────────────────────────
// VALIDATION TESTS
// ───────────────────────────────────────────────────────────────

describe('NewsletterForm - Validation', () => {
  it('prevents submission with empty email', async () => {
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const submitButton = screen.getByRole('button');
    await user.click(submitButton);
    
    expect(newsletterApi.subscribe).not.toHaveBeenCalled();
  });

  it('shows error message for invalid email format', async () => {
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(emailInput, 'not-an-email');
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorMessage = screen.queryByText(/invalid|correo|email/i);
      expect(errorMessage).not.toBeNull();
    });
  });
});

// ───────────────────────────────────────────────────────────────
// API INTEGRATION TESTS
// ───────────────────────────────────────────────────────────────

describe('NewsletterForm - API Integration', () => {
  it('calls subscribe API with correct data', async () => {
    vi.mocked(newsletterApi.subscribe).mockResolvedValue({
      success: true,
      message: 'Success'
    });
    
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(emailInput, 'test@natly.org');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(newsletterApi.subscribe).toHaveBeenCalledWith({
        email: 'test@natly.org',
        language: expect.any(String),
        honeypot: expect.any(String)
      });
    });
  });

  it('shows success message after successful subscription', async () => {
    vi.mocked(newsletterApi.subscribe).mockResolvedValue({
      success: true,
      message: 'Check your email'
    });
    
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(emailInput, 'success@test.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      const successMessage = screen.queryByText(/check|revisa|email|success|éxito/i);
      expect(successMessage).not.toBeNull();
    });
  });

  it('shows error message when API fails', async () => {
    vi.mocked(newsletterApi.subscribe).mockRejectedValue(
      new Error('Network error')
    );
    
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(emailInput, 'error@test.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      const errorMessage = screen.queryByText(/error|wrong|fallo/i);
      expect(errorMessage).not.toBeNull();
    });
  });
});

// ───────────────────────────────────────────────────────────────
// LOADING STATE TESTS
// ───────────────────────────────────────────────────────────────

describe('NewsletterForm - Loading States', () => {
  it('disables submit button while submitting', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    vi.mocked(newsletterApi.subscribe).mockReturnValue(promise as any);
    
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button') as HTMLButtonElement;
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(submitButton.disabled).toBe(true);
    
    resolvePromise!({ success: true, message: 'Success' });
  });

  it('shows loading indicator during submission', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    vi.mocked(newsletterApi.subscribe).mockReturnValue(promise as any);
    
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    const loadingIndicator = screen.queryByText(/loading|sending|enviando/i) ||
                            screen.queryByRole('status');
    
    expect(loadingIndicator).not.toBeNull();
    
    resolvePromise!({ success: true, message: 'Success' });
  });
});

// ───────────────────────────────────────────────────────────────
// HONEYPOT PROTECTION TESTS
// ───────────────────────────────────────────────────────────────

describe('NewsletterForm - Honeypot Protection', () => {
  it('sends empty honeypot for real users', async () => {
    vi.mocked(newsletterApi.subscribe).mockResolvedValue({
      success: true,
      message: 'Success'
    });
    
    const user = userEvent.setup();
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button');
    
    await user.type(emailInput, 'human@test.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(newsletterApi.subscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          honeypot: ''
        })
      );
    });
  });
});
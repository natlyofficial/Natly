import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Confirm() {
  const { t } = useTranslation('confirm');
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');

  useEffect(() => {
    const confirmSubscription = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('https://api-natly.netlify.app/.netlify/functions/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus(data.alreadyConfirmed ? 'already' : 'success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Confirm error:', error);
        setStatus('error');
      }
    };

    confirmSubscription();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-700">
        
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 dark:from-blue-600 dark:to-blue-800 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🦅</span>
          </div>
          <h1 className="text-3xl font-black text-blue-900 dark:text-white tracking-tight">
            Natly
          </h1>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-100 dark:border-gray-700 border-t-blue-600 dark:border-t-yellow-400 mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {t('loading')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t('loadingSubtitle')}
            </p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
              <span className="text-6xl">✅</span>
            </div>
            <h2 className="text-3xl font-black text-green-600 dark:text-green-400 mb-3">
              {t('success.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('success.message')}
            </p>
            
            <Link 
              to="/flashcard" 
              className="inline-flex items-center gap-3 bg-blue-900 dark:bg-yellow-500 text-white dark:text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 dark:hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              {t('success.button')}
              <span className="text-xl">→</span>
            </Link>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('success.checkEmail')}
              </p>
            </div>
          </div>
        )}

        {/* Already confirmed */}
        {status === 'already' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <span className="text-6xl">✓</span>
            </div>
            <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-3">
              {t('already.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('already.message')}
            </p>
            
            <Link 
              to="/flashcard" 
              className="inline-flex items-center gap-3 bg-blue-900 dark:bg-yellow-500 text-white dark:text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 dark:hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              {t('already.button')}
              <span className="text-xl">→</span>
            </Link>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
              <span className="text-6xl">❌</span>
            </div>
            <h2 className="text-3xl font-black text-red-600 dark:text-red-400 mb-3">
              {t('error.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {t('error.message')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {t('error.help')}
            </p>
            
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 bg-blue-900 dark:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 dark:hover:bg-gray-600 transition-all transform hover:scale-105 shadow-xl"
            >
              {t('error.button')}
            </Link>
          </div>
        )}

        {/* Footer help */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('footer.help')}{' '}
            <a 
              href="mailto:contact@natly.org" 
              className="text-blue-600 dark:text-yellow-400 font-bold hover:underline"
            >
              contact@natly.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
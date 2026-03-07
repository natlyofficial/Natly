import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Unsubscribe() {
  const { t } = useTranslation('unsubscribe');
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle');
  const [reason, setReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
    }
  }, [searchParams]);

  const handleUnsubscribe = async (withReason: boolean = false) => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('https://api-natly.netlify.app/.netlify/functions/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          reason: withReason ? reason : undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(data.alreadyUnsubscribed ? 'already' : 'success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setStatus('error');
    }
  };

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

        {/* Idle - Confirm unsubscribe */}
        {status === 'idle' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
              <span className="text-6xl">👋</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-3">
              {t('idle.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('idle.message')}
            </p>

            {!showReasonInput ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleUnsubscribe(false)}
                  className="w-full bg-red-600 dark:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all shadow-xl"
                >
                  {t('idle.confirmButton')}
                </button>
                
                <button
                  onClick={() => setShowReasonInput(true)}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {t('idle.reasonButton')}
                </button>

                <Link
                  to="/"
                  className="block text-blue-600 dark:text-yellow-400 font-bold hover:underline mt-4"
                >
                  {t('idle.cancelButton')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('idle.reasonPlaceholder')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
                <button
                  onClick={() => handleUnsubscribe(true)}
                  disabled={!reason.trim()}
                  className="w-full bg-red-600 dark:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('idle.submitButton')}
                </button>
                <button
                  onClick={() => setShowReasonInput(false)}
                  className="w-full text-gray-600 dark:text-gray-400 hover:underline"
                >
                  {t('idle.backButton')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div className="py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-100 dark:border-gray-700 border-t-blue-600 dark:border-t-yellow-400 mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {t('loading')}
            </h2>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <span className="text-6xl">✓</span>
            </div>
            <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-3">
              {t('success.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {t('success.message')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {t('success.subtitle')}
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
                {t('success.resubscribe')}{' '}
                <Link to="/" className="text-blue-600 dark:text-yellow-400 font-bold hover:underline">
                  natly.org
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Already unsubscribed */}
        {status === 'already' && (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <span className="text-6xl">✓</span>
            </div>
            <h2 className="text-3xl font-black text-gray-600 dark:text-gray-300 mb-3">
              {t('already.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('already.message')}
            </p>
            
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 bg-blue-900 dark:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 dark:hover:bg-gray-600 transition-all transform hover:scale-105 shadow-xl"
            >
              {t('already.button')}
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
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('error.message')}
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
// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../services/auth';

const Login = () => {
  const { t } = useTranslation();
  const { signIn, error: authError, loading } = useAuth();
  const [error, setError] = useState('');

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {t('common.family')} {t('auth.signInRequired')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('auth.signInToAccess')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={signIn}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.loading')}
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C8.203 2 4.657 5.135 3.5 9.264a9.981 9.981 0 006.222 12.249 10.062 10.062 0 006.103-1.174c3.39-2.17 5.132-6.272 4.536-10.322l-7.816-.013z" />
              </svg>
              {t('auth.signInWithGoogle')}
            </>
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('common.family')} TV Dashboard
        </div>
      </div>
    </div>
  );
};

export default Login;
// src/components/common/LoadingScreen.jsx
import { useTranslation } from 'react-i18next';

const LoadingScreen = ({ message }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
      <p className="mt-4 text-lg font-medium text-gray-800 dark:text-white">
        {message || t('common.loading')}
      </p>
    </div>
  );
};

export default LoadingScreen;
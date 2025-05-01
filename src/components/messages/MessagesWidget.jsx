// src/components/messages/MessagesWidget.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useSheetsService from '../../services/sheets';
import MessageCard from './MessageCard';

const MessagesWidget = () => {
  const { t } = useTranslation();
  const sheetsService = useSheetsService();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch messages data
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sheetsService.getFamilyMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(t('messages.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMessages();
    
    // Set up event listener for refresh
    const handleRefresh = () => fetchMessages();
    window.addEventListener('refreshWidgets', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshWidgets', handleRefresh);
    };
  }, []);

  // Loading state
  if (loading && messages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {t('messages.title')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button 
            onClick={fetchMessages}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-lg"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // Determine which messages to show
  const visibleMessages = showAll ? messages : messages.slice(0, 5);
  const hasMoreMessages = messages.length > 5;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {t('messages.title')}
      </h2>
      
      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('messages.noMessages')}</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
          {visibleMessages.map(message => (
            <MessageCard key={message.id} message={message} />
          ))}
          
          {hasMoreMessages && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {showAll ? t('messages.showLess') : t('messages.showMore')}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Refresh indicator */}
      {loading && messages.length > 0 && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('common.refreshing')}
        </div>
      )}
    </div>
  );
};

export default MessagesWidget;
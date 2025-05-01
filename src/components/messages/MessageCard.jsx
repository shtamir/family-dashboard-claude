// src/components/messages/MessageCard.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Priority color mapping
const PRIORITY_COLORS = {
  high: 'bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-700',
  medium: 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700',
  low: 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
};

const MessageCard = ({ message }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    
    const today = new Date();
    const messageDate = new Date(date);
    
    // If today, show time
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // If this year, show month and day
    if (messageDate.getFullYear() === today.getFullYear()) {
      return messageDate.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    // Otherwise show full date
    return messageDate.toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get color class based on priority
  const priorityClass = PRIORITY_COLORS[message.priority] || PRIORITY_COLORS.low;
  
  // Check if message is long
  const isLongMessage = message.message.length > 120;
  
  // Get shortened message if needed
  const displayMessage = isLongMessage && !isExpanded
    ? `${message.message.substring(0, 120)}...`
    : message.message;

  return (
    <div className={`p-4 rounded-lg border-l-4 ${priorityClass} shadow-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="font-medium text-gray-800 dark:text-white">
            {message.author}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
            {formatDate(message.timestamp)}
          </span>
        </div>
        
        {message.priority === 'high' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {t('messages.highPriority')}
          </span>
        )}
      </div>
      
      <div className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {displayMessage}
      </div>
      
      {isLongMessage && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
        >
          {isExpanded ? t('common.showLess') : t('common.showMore')}
        </button>
      )}
      
      {!message.read && (
        <div className="mt-2 text-right">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {t('messages.new')}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageCard;
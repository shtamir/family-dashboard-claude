// src/components/todos/TodoItem.jsx
import { useTranslation } from 'react-i18next';

// Priority color mapping
const PRIORITY_COLORS = {
  high: 'border-red-300 dark:border-red-700',
  medium: 'border-yellow-300 dark:border-yellow-700',
  low: 'border-blue-300 dark:border-blue-700'
};

// Category color mapping
const CATEGORY_COLORS = {
  Home: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Work: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  School: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Shopping: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Health: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  Bills: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  General: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
};

const TodoItem = ({ todo }) => {
  const { t } = useTranslation();
  
  // Format due date
  const formatDueDate = () => {
    if (!todo.dueDate) return '';
    
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    
    // If today
    if (dueDate.toDateString() === today.toDateString()) {
      return t('todos.dueToday');
    }
    
    // If tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dueDate.toDateString() === tomorrow.toDateString()) {
      return t('todos.dueTomorrow');
    }
    
    // If within a week
    const oneWeek = new Date(today);
    oneWeek.setDate(oneWeek.getDate() + 7);
    if (dueDate < oneWeek) {
      return dueDate.toLocaleDateString(undefined, { weekday: 'long' });
    }
    
    // Otherwise show full date
    return dueDate.toLocaleDateString(undefined, { 
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get priority class
  const priorityClass = PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS.low;
  
  // Get category class
  const categoryClass = CATEGORY_COLORS[todo.category] || CATEGORY_COLORS.General;
  
  return (
    <div className={`p-3 rounded-lg border ${priorityClass} ${todo.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex items-start">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <div className={`w-5 h-5 rounded border ${
            todo.completed 
              ? 'bg-blue-500 border-blue-500 flex items-center justify-center' 
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        <div className="ml-3 flex-1">
          {/* Task info */}
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${
                todo.completed 
                  ? 'text-gray-500 dark:text-gray-500 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {todo.task}
              </p>
              
              {todo.assignedTo && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('todos.assignedTo')}: {todo.assignedTo}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <span className={`inline-flex text-xs px-2 py-0.5 rounded-full ${categoryClass}`}>
                {todo.category}
              </span>
            </div>
          </div>
          
          {/* Due date */}
          {todo.dueDate && (
            <div className={`text-xs mt-1 flex items-center ${
              todo.overdue 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {formatDueDate()}
                {todo.overdue && ` (${t('todos.overdue')})`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
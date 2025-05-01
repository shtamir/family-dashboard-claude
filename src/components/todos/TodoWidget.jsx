// src/components/todos/TodoWidget.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useSheetsService from '../../services/sheets';
import TodoItem from './TodoItem';

const TodoWidget = () => {
  const { t } = useTranslation();
  const sheetsService = useSheetsService();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, completed
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch todo data
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sheetsService.getTodoList();
      setTodos(data);
      
      // Extract unique categories
      const categories = new Set(data.map(todo => todo.category));
      if (categories.size > 0 && activeCategory === 'all') {
        // Only set this on first load
        setActiveCategory('all');
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(t('todos.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTodos();
    
    // Set up event listener for refresh
    const handleRefresh = () => fetchTodos();
    window.addEventListener('refreshWidgets', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshWidgets', handleRefresh);
    };
  }, []);

  // Loading state
  if (loading && todos.length === 0) {
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
          {t('todos.title')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button 
            onClick={fetchTodos}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-lg"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = ['all', ...new Set(todos.map(todo => todo.category))];

  // Filter todos based on active filters
  const filteredTodos = todos.filter(todo => {
    // Filter by completion status
    if (activeFilter === 'pending' && todo.completed) return false;
    if (activeFilter === 'completed' && !todo.completed) return false;
    
    // Filter by category
    if (activeCategory !== 'all' && todo.category !== activeCategory) return false;
    
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {t('todos.title')}
      </h2>
      
      {/* Filters */}
      <div className="mb-4">
        <div className="flex mb-2 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-3 text-sm font-medium ${
              activeFilter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            {t('todos.all')}
          </button>
          <button
            className={`py-2 px-3 text-sm font-medium ${
              activeFilter === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveFilter('pending')}
          >
            {t('todos.pending')}
          </button>
          <button
            className={`py-2 px-3 text-sm font-medium ${
              activeFilter === 'completed'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveFilter('completed')}
          >
            {t('todos.completed')}
          </button>
        </div>
        
        {/* Categories */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(category => (
              <button
                key={category}
                className={`px-2 py-1 text-xs rounded-full ${
                  activeCategory === category
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? t('todos.allCategories') : category}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('todos.noTasks')}</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-350px)]">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
      
      {/* Task summary */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          {t('todos.summary', {
            completed: todos.filter(t => t.completed).length,
            total: todos.length
          })}
        </p>
      </div>
      
      {/* Refresh indicator */}
      {loading && todos.length > 0 && (
        <div className="mt-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
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

export default TodoWidget;
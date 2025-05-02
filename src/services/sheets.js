// src/services/sheets.js
import { useAuth } from './auth';

// Sheet ID from the shared Google Sheet
const DEFAULT_SPREADSHEET_ID = '1doFkehlUaBnt6NBCfQQqwL0h4zANey2MWF9px3qgaDQ';

// Google Sheets service for interacting with Google Sheets API
export const useSheetsService = () => {
  const { fetchWithAuth } = useAuth();
  const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

  // Get spreadsheet ID from config or use default
  const getSpreadsheetId = () => {
    try {
      const config = localStorage.getItem('family_portal_config');
      if (config) {
        const { spreadsheetId } = JSON.parse(config);
        return spreadsheetId || DEFAULT_SPREADSHEET_ID;
      }
    } catch (error) {
      console.error('Error getting spreadsheet ID:', error);
    }
    return DEFAULT_SPREADSHEET_ID;
  };

  // Fetch sheet data by range
  const getSheetData = async (range) => {
    try {
      const spreadsheetId = getSpreadsheetId();
      const url = `${BASE_URL}/${spreadsheetId}/values/${encodeURIComponent(range)}`;
      
      const result = await fetchWithAuth(url);
      return result.values || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  };

  // Fetch family messages from the "Messages" sheet
  const getFamilyMessages = async () => {
    try {
      const range = 'Messages!A2:E'; // A2:E to skip header row
      const data = await getSheetData(range);
      
      // Transform data into structured messages
      return data.map((row, index) => {
        // Expected columns: Timestamp, Author, Message, Priority, Read
        return {
          id: index.toString(),
          timestamp: row[0] ? new Date(row[0]) : new Date(),
          author: row[1] || 'Unknown',
          message: row[2] || '',
          priority: row[3] === 'High' ? 'high' : row[3] === 'Medium' ? 'medium' : 'low',
          read: row[4] === 'Yes' || row[4] === 'TRUE',
        };
      }).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending
    } catch (error) {
      console.error('Error fetching family messages:', error);
      throw error;
    }
  };

  // Fetch to-do list from the "ToDo" sheet
  const getTodoList = async () => {
    try {
      const range = 'ToDo!A2:F'; // A2:F to skip header row
      const data = await getSheetData(range);
      
      // Transform data into structured todo items
      return data.map((row, index) => {
        // Expected columns: Task, Assigned To, Due Date, Priority, Category, Completed
        const dueDate = row[2] ? new Date(row[2]) : null;
        
        return {
          id: index.toString(),
          task: row[0] || '',
          assignedTo: row[1] || '',
          dueDate,
          priority: row[3] === 'High' ? 'high' : row[3] === 'Medium' ? 'medium' : 'low',
          category: row[4] || 'General',
          completed: row[5] === 'Yes' || row[5] === 'TRUE',
          overdue: dueDate && new Date() > dueDate && row[5] !== 'Yes' && row[5] !== 'TRUE'
        };
      }).sort((a, b) => {
        // Sort by completion status, then priority (high first), then due date
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        
        const priorityValues = { high: 0, medium: 1, low: 2 };
        if (a.priority !== b.priority) return priorityValues[a.priority] - priorityValues[b.priority];
        
        if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
        return a.dueDate ? -1 : b.dueDate ? 1 : 0;
      });
    } catch (error) {
      console.error('Error fetching todo list:', error);
      throw error;
    }
  };

  return {
    getSheetData,
    getFamilyMessages,
    getTodoList
  };
};

export default useSheetsService;
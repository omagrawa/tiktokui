// Configuration file for API endpoints and environment variables
const config = {
  // API base URL - will use environment variable or fallback to localhost
  //  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://ticktokbackend-production.up.railway.app',
  
  // API endpoints
  UPLOAD_EXCEL: '/api/upload-excel',
  
  // Get full API URL for a specific endpoint
  getApiUrl: (endpoint) => `${config.API_BASE_URL}${endpoint}`,
};

export default config; 
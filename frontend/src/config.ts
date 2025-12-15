// API Configuration
// Change this when deploying to production or using a different port

export const API_BASE_URL = 'https://apiverse.smartbot.co.nz'; // http://localhost:8001 || 'https://APIVerse.smartbot.co.nz';

// Derived URLs
export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  fileSearch: `${API_BASE_URL}/api/file-search`,
  widget: `${API_BASE_URL}/api/widget`,
  payment: `${API_BASE_URL}/api/v1/payment`,
  email: `${API_BASE_URL}/api/v1/email`,
  sms: `${API_BASE_URL}/api/v1/sms`,
  phone: `${API_BASE_URL}/api/v1/phone`,
  chat: `${API_BASE_URL}/api/v1/chat`,
  nzCredit: `${API_BASE_URL}/api/v1/nz-credit`,
  subscriptions: `${API_BASE_URL}/subscriptions`,
};

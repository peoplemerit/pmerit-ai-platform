// PMERIT API Configuration - Connect to Operational Containers
const API_BASE_URL = 'http://localhost';
const API_ENDPOINTS = {
    AUTH: `${API_BASE_URL}:9001/api/auth`,
    USERS: `${API_BASE_URL}:9001/api/users`,
    COURSES: `${API_BASE_URL}:9002/api/courses`,
    ENROLLMENT: `${API_BASE_URL}:9002/api/enrollment`,
    VIRTUAL_HUMAN: `${API_BASE_URL}:9003/api/avatar`,
    ASSESSMENTS: `${API_BASE_URL}:9004/api/assessments`,
    OCR: `${API_BASE_URL}:9005/api/ocr`,
    AI_TUTOR: `${API_BASE_URL}:9006/api/tutor`,
    CHAT: `${API_BASE_URL}:9006/api/chat`,
    CAREER: `${API_BASE_URL}:9007/api/career`,
    PAYMENTS: `${API_BASE_URL}:9008/api/payments`,
    COMMUNICATION: `${API_BASE_URL}:9009/api/messaging`,
    ANALYTICS: `${API_BASE_URL}:9010/api/analytics`,
    DATABASE: `${API_BASE_URL}:15432`
};
window.PMERIT_API = API_ENDPOINTS;
console.log('🔗 PMERIT API Configuration loaded - Connected to 13 containers');

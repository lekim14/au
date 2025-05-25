import axios from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Advisers services
export const adviserService = {
  getAll: () => api.get('/advisers'),
  getById: (id) => api.get(`/advisers/${id}`),
  create: (adviser) => api.post('/advisers', adviser),
  update: (id, adviser) => api.put(`/advisers/${id}`, adviser),
  delete: (id) => api.delete(`/advisers/${id}`)
};

// Classes services
export const classService = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (classData) => api.post('/classes', classData),
  update: (id, classData) => api.put(`/classes/${id}`, classData),
  delete: (id) => api.delete(`/classes/${id}`),
  getAdvisoryClasses: () => api.get('/classes/advisory')
};

// Subjects services
export const subjectService = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (subject) => api.post('/subjects', subject),
  update: (id, subject) => api.put(`/subjects/${id}`, subject),
  delete: (id) => api.delete(`/subjects/${id}`),
  getSessions: (id) => api.get(`/subjects/${id}/sessions`)
};

// Students services
export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  delete: (id) => api.delete(`/students/${id}`),
  importStudents: (studentsData) => api.post('/students/import', studentsData),
  getByClass: (classId) => api.get(`/students/class/${classId}`),
  getByClasses: (classIds) => api.post('/students/classes', { classIds })
};

// Announcements services
export const announcementService = {
  getAll: () => api.get('/announcements'),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (announcement) => api.post('/announcements', announcement),
  update: (id, announcement) => api.put(`/announcements/${id}`, announcement),
  delete: (id) => api.delete(`/announcements/${id}`),
  pin: (id, isPinned) => api.put(`/announcements/${id}/pin`, { isPinned })
};

// Survey services
export const surveyService = {
  submitSurvey: (formData) => {
    return api.post('/surveys/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getMySubmissions: () => api.get('/surveys/my-submissions'),
  getAllSubmissions: () => api.get('/surveys/all'),
  updateStatus: (id, status) => api.put(`/surveys/${id}/status`, { status })
};

export default api; 
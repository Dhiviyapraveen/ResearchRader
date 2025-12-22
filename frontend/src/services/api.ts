import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  interests?: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Conference {
  id: string;
  title: string;
  date: string;
  venue: string;
  topic: string;
  source: string;
  registrationLink: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  source: string;
  link: string;
  type?: string;
  createdAt?: string;
}

// Auth API
export const authApi = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/signup', { name, email, password });
    return response.data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
    return response.data;
  },
};

// Conferences API
export const conferencesApi = {
  getAll: async (): Promise<Conference[]> => {
    const response = await api.get<Conference[]>('/api/conferences');
    return response.data;
  },
};

// Opportunities API
export const opportunitiesApi = {
  getAll: async (): Promise<Opportunity[]> => {
    const response = await api.get<Opportunity[]>('/api/opportunities');
    return response.data;
  },
};

// Profile API
export const profileApi = {
  get: async (): Promise<User> => {
    const response = await api.get<User>('/api/profile');
    return response.data;
  },
};

export default api;

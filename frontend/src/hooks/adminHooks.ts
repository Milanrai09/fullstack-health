import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

interface Article {
  _id: string;
}

const BASE_URL = 'https://fullstack-health-backend.vercel.app';
const api: AxiosInstance = axios.create({ baseURL: BASE_URL });

// Add request interceptor
api.interceptors.request.use((config) => {
  const healthToken = localStorage.getItem('healthToken');
  const token = healthToken ? JSON.parse(healthToken).token : null;
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login page
      window.location.href = '/login';
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const approveArticle = async (id: string): Promise<ApiResponse<Article>> => {
  try {
    const response = await api.put(`/api/articles/approveCreate/${id}`);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { error: 'Authentication failed. Please log in again.', data: null };
        }
      }
    }
    console.error(error);
    return { error: 'Error approving article', data: null };
  }
};

export const approveEditArticle = async (id: string): Promise<ApiResponse<Article>> => {
  try {
    const response = await api.put(`/api/articles/approveEdit/${id}`);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { error: 'Authentication failed. Please log in again.', data: null };
        }
      }
    }
    console.error(error);
    return { error: 'Error approving article edit', data: null };
  }
};
export const promoteUser = async (id: string): Promise<ApiResponse<Article>> => {
  try {
    const response = await api.put(`/api/admin/promote/${id}`);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { error: 'Authentication failed. Please log in again.', data: null };
        }
      }
    }
    console.error(error);
    return { error: 'Error approving article edit', data: null };
  }
};


export const demoteUser = async (id: string): Promise<ApiResponse<Article>> => {
  try {
    const response = await api.put(`/api/admin/demote/${id}`);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { error: 'Authentication failed. Please log in again.', data: null };
        }
      }
    }
    console.error('Error demoting user:', error);
    return { error: 'Error demoting user', data: null };
  }
};

export const deleteUser = async (id: string): Promise<ApiResponse<Article>> => {
  try {
    const response = await api.delete(`/api/users/deleteUser/${id}`);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { error: 'Authentication failed. Please log in again.', data: null };
        }
      }
    }
    console.error(error);
    return { error: 'Error deleting user', data: null };
  }
};

export const deleteArticle = async (articleId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete(`/api/article/delete/${articleId}`);
    return { data: response.data, error: undefined };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { error: 'Authentication failed. Please log in again.', data: null };
        }
      }
    }
    console.error('Error deleting article:', error);
    return { data: null, error: 'Error deleting article' };
  }
};


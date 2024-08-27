import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiResponse<T> {
  data: T | null ;
  error?: string;
}

interface Article {
  _id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  status: string;
  category: string;
}

  const BASE_URL = 'https://fullstack-health-backend.vercel.app';

const api: AxiosInstance = axios.create({ baseURL: BASE_URL });

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

export const getAllArticles = async (): Promise<any[]> => {
  try {
    const response = await api.get('/article/getAllArticle');
    return response.data; 
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createArticle = async (article: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post('/api/article/create', article);
    return response.data;
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
    console.error('Error creating article:', error);
    throw error;
  }
};

export const likeArticle = async (articleId: string, userId: string): Promise<ApiResponse<any>> => {
  try {
    console.log(userId,articleId)
    const response = await api.put('/api/article/like', { articleId, userId });
    return response.data;
  } catch (error) {
    console.error('Error liking article:', error);
    throw error;
  }
};

export const dislikeArticle = async (articleId: string, userId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put('/article/dislike', { articleId, userId });
    return response.data;
  } catch (error) {
    console.error('Error disliking article:', error);
    throw error;
  }
};



export const saveArticle = async (articleId: string, userId: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post('/api/articles/save', { articleId, userId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 409) {
          console.log('Article already saved');
          return { data: null, error: 'Article already saved' };
        } else if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { data: null, error: 'Authentication failed. Please log in again.' };
        }
      }
    }
    console.error('Error saving article:', error);
    return { data: null, error: 'Failed to save article' };
  }
};

export const getSavedArticle = async (authorId: string): Promise<ApiResponse<Article[]>> => {
  try {
    const response = await api.get(`/api/articles/getsaved?userId=${authorId}`);
    console.log('Raw API Response:', response);

    if (response.data && response.data.data) {
      return { data: response.data.data };
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { data: [], error: 'Authentication failed. Please log in again.' };
        }
      }
    }
    console.error('Error fetching saved articles:', error);
    return { data: [], error: 'Failed to fetch saved articles' };
  }
};

export const editArticle = async (articleId: string, userId: string, title: string, content: string) => {
  try {
    const response = await api.post('/api/articles/edit', {
      id: articleId,
      userId,
      title,
      content
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden. Removing healthToken from localStorage.');
          localStorage.removeItem('healthToken');
          return { data: [], error: 'Authentication failed. Please log in again.' };
        }
      }
    }
    console.error('Error editing article:', error);
    throw error;
  }
};


export const deleteArticle = async (articleId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete(`/api/article/delete/${articleId}`);
    return response.data;
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
    return { error: 'Failed to delete article', data: null };
  }
};

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosInstance } from 'axios';
import apiClient from "../apiClient";

export interface ApiResponse<T> {
  data: T;
  error?: string;
}



interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  credential: string;
  username: string;
}


interface GoogleRegisterData {
  token: string;
  username: string;
}

interface GoogleRegisterResponse {
  message: string;
  userData: {
    userId: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    token: string;
  };
}

const BASE_URL = `https://fullstack-health-backend.vercel.app/`
const api: AxiosInstance = axios.create({ baseURL: BASE_URL });

export const useGetAllUsers = async (): Promise<UserInfo[]> => {
  try {  
    
  const healthToken = localStorage.getItem('healthToken');
  const token = healthToken ? JSON.parse(healthToken).token : null;

  if (!token) {
    throw new Error('Token not found');
  }
    const response = await api.get<UserInfo[]>('/api/users/getAllUser', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNeutritionalInfo = async (search: string): Promise<{ data: any } | { error: string, data: null, status?: number }> => {
  try {
    const response = await api.get(`/api/nutrition/${search}`);
    return { data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        return { error: 'Unauthorized', data: null, status: 401 };
      }
      return { error: error.response.data.message || 'Error fetching nutritional info', data: null };
    }
    return { error: 'Error fetching nutritional info', data: null };
  }
};


export const useLoginMutation = () =>
  useMutation<{ userData: UserInfo }, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      const response = await apiClient.post<{ userData: UserInfo }>(`/api/user/login`, { email, password }, { withCredentials: true });
      return response.data;
    },
  });
  
  export const useRegisterMutation = () => {
    return useMutation<{ redirectUrl: string; userData: any }, Error, RegisterData>({
      mutationFn: async (registerData: RegisterData) => {
        try {
          const response = await api.post<{ redirectUrl: string; userData: any }>(
            '/api/users/register', 
            registerData,
            { withCredentials: true }
          );
          return response.data;
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },
    });
  };


export const useGoogleRegisterMutation = () => {
  return useMutation<GoogleRegisterResponse, Error, GoogleRegisterData>({
    mutationFn: async (googleRegisterData: GoogleRegisterData) => {
      try {
        const response = await api.post<GoogleRegisterResponse>('/api/user/google-signup', {
          token: googleRegisterData.token,
          username: googleRegisterData.username,
        });
        console.log('Status:', response.status);
        console.log('UserData:', response.data);

        const userdata = {
          isAdmin: response.data.userData.isAdmin,
          userId: response.data.userData.userId,
          isSuperAdmin: response.data.userData.isSuperAdmin,
          token: response.data.userData.token,
        };
        localStorage.setItem('healthToken', JSON.stringify(userdata));

        return response.data;
      } catch (error) {
        console.error('Google register error:', error);
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error || 'An error occurred during registration');
        }
        throw error;
      }
    },
  });
};



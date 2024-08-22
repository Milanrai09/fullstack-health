
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const API_BASE_URL = 'http://localhost:9000'; // Adjust this to your backend URL

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface GoogleRegisterData {
  token: string;
  username: string;
}

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const registerUser = async (data: RegisterData) => {
    console.log('registerUser function called with data:', data);
    try {
      console.log('Fetching from:', `${API_BASE_URL}/api/users/register`);
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      
      });
      console.log('Fetch response:', response);
  
      if (!response.ok) {
        console.log('Response not OK, status:', response.status);
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(errorData.error || 'Registration failed');
      }
  
      const result = await response.json();
      console.log('Registration successful, result:', result);
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
  const googleRegister = async (data: GoogleRegisterData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/google-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Google registration failed');
    }

    return response.json();
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Confirm Password length:', confirmPassword.length);
  
    if (!name || !email || !password || !confirmPassword) {
      console.log('Validation failed: All fields are required');
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      setError('Passwords do not match');
      return;
    }
  
    console.log('Validation passed, attempting to register user');
    setIsLoading(true);
    try {
      console.log('Calling registerUser function');
      const result = await registerUser({ name, email, password });
      console.log('Registration result:', result);
      console.log('User data:', result.userData);
  
      console.log('Storing token in localStorage');
      localStorage.setItem('healthToken', JSON.stringify(result.userData));
      
      console.log('Navigating to home page');
      navigate('/', { replace: true });
      
      window.location.reload();
      
      console.log('Showing success toast');
      toast.success('Registration successful');
    } catch (error) {
      console.error('Error during registration:', error);
      if (error instanceof Error) {
        console.log('Error is instance of Error');
        console.log('Error message:', error.message);
        setError(error.message);
        console.log('hello from the error instead of error');
      } else {
        console.log('Error is not instance of Error');
        setError('An unexpected error occurred');
      }
      console.log('Showing error toast');
      toast.error('Registration failed');
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error('Google login failed');
      return;
    }

    setIsLoading(true);
    try {
      const result = await googleRegister({
        token: response.credential,
        username: name
      });
      if (result && result.userData) {
        navigate('/', { replace: true });
        toast.success('Google registration successful');
      }
    } catch (error) {
      console.error('Error during Google registration:', error);
      toast.error('Google registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="or-divider">
        <span>or</span>
      </div>
      <div className="googleOauth">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error('Google login failed')}
        />
      </div>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterScreen;
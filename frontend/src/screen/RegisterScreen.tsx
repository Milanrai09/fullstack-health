import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRegisterMutation } from '../hooks/userHooks'; // Using the register hook

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
  
  // Use the custom hook for registering users
  const registerMutation = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerMutation.mutateAsync({ name, email, password });
      localStorage.setItem('healthToken', JSON.stringify(result.userData));

      navigate('/', { replace: true });
      window.location.reload();
      toast.success('Registration successful');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      toast.error('Registration failed');
    } finally {
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

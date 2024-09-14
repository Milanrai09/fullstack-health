import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRegisterMutation, useGoogleRegisterMutation } from '../hooks/userHooks';

// Define the RegisterData type
type RegisterData = {
  name: string;
  email: string;
  password: string;
  credential?: string;
  username?: string;
};

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const registerMutation = useRegisterMutation();
  const googleRegisterMutation = useGoogleRegisterMutation();

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
      const registerData: RegisterData = { name, email, password };
      const result = await registerMutation.mutateAsync(registerData);
      localStorage.setItem('healthToken', JSON.stringify(result.userData));
      navigate('/', { replace: true });
      window.location.reload();
      toast.success('Registration successful');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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
      const result = await googleRegisterMutation.mutateAsync({
        credential: response.credential,
        username: name,
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
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="or-divider">
        <span>or</span>
      </div>
      <div className="googleOauth">
        <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error('Google login failed')} />
      </div>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterScreen;

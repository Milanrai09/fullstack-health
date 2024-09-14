import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleRegisterMutation, useLoginMutation } from '../hooks/userHooks';
import { toast } from 'react-toastify';
import {useLoginMutation} from '../hooks/userHooks';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const googleRegisterMutation = useGoogleRegisterMutation();
  const loginMutation = useLoginMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
  
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result && result.userData) {
        localStorage.setItem('healthToken', JSON.stringify(result.userData));
        
        navigate(redirect);
        toast.success('Login successful');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async (response: any) => {
    console.log('Google login response:', response);
    try {
      const result = await googleRegisterMutation.mutateAsync({
        token: response.credential,
        username: '', // You might want to get this from the Google response
      });
      if (result && result.userData) {
        localStorage.setItem('healthToken', JSON.stringify(result.userData));
        navigate(redirect);
        toast.success('Google login successful');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      toast.error('Google login failed');
    }
  };

  const handleGoogleError = () => {
    console.log('Google login error');
    toast.error('Google login failed');
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic here
    console.log('Forgot password clicked.');
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </div>
      </form>

      <div className="or-divider">
        <span>or</span>
      </div>
      <div className="googleOauth">
        <GoogleLogin onSuccess={handleGoogleLogin} onError={handleGoogleError} />
      </div>
    </div>
  );
};

export default LoginScreen;

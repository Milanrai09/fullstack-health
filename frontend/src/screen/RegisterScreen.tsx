import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation, useGoogleAuthMutation } from '../hooks/userHooks';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  credential: string;
  username: string;
}

interface GoogleAuthData {
  token: string;
  username?: string;
}

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState('');
  
  const registerMutation = useRegisterMutation();
  const googleAuthMutation = useGoogleAuthMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const { name, email, password, confirmPassword, username } = formData;

    if (!name || !email || !password || !confirmPassword || !username) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const registerData: RegisterData = {
        name,
        email,
        password,
        credential: password, // Using password as credential
        username,
      };
      const result = await registerMutation.mutateAsync(registerData);
      handleAuthSuccess(result);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      const result = await googleAuthMutation.mutateAsync({
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


  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        
        <button type="submit">
          Register
        </button>
      </form>
      <div className="or-divider">
        <span>or</span>
      </div>
     <div className="googleOauth">
        <GoogleLogin onSuccess={handleGoogleLogin} onError={handleGoogleError} />
      </div>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterScreen;

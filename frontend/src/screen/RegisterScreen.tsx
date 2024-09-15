import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation, useGoogleAuthMutation } from '../hooks/userHooks';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  googleToken?: string;
}

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
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
      };
      const result = await registerMutation.mutateAsync(registerData);
      handleAuthSuccess(result);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // In a real scenario, you would obtain the Google token here
      // For this example, we'll use a placeholder
      const googleToken = "placeholder_google_token";
      
      const result = await googleAuthMutation.mutateAsync({ googleToken });
      handleAuthSuccess(result);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthSuccess = (result: any) => {
    localStorage.setItem('healthToken', JSON.stringify(result.userData));
    navigate('/', { replace: true });
    toast.success('Registration successful');
  };

  const handleAuthError = (error: any) => {
    setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    toast.error('Registration failed');
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
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        
        <button type="submit" disabled={registerMutation.isLoading}>
          {registerMutation.isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="or-divider">
        <span>or</span>
      </div>
      <button onClick={handleGoogleAuth} disabled={googleAuthMutation.isLoading}>
        {googleAuthMutation.isLoading ? 'Authenticating...' : 'Register with Google'}
      </button>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterScreen;

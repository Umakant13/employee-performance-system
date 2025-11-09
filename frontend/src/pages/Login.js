/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  Person,
  Lock,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAdmin } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const result = await login(credentials);

  if (result.success) {
    // Get fresh user data after login
    const userData = JSON.parse(localStorage.getItem('user'));
    
    console.log('User data after login:', userData); // Debug log
    
    // Check role from user data
    if (userData && userData.role === 'admin') {
      console.log('Redirecting to admin dashboard'); // Debug log
      navigate('/admin/dashboard');
    } else {
      console.log('Redirecting to employee dashboard'); // Debug log
      navigate('/employee/dashboard');
    }
  } else {
    setError(result.message);
  }

  setLoading(false);
};

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
            <LoginIcon sx={{ mr: 2, fontSize: 50 }} />
            <Typography component="h1" variant="h4" fontWeight="bold">
              Welcome Back
            </Typography>
          </Box>

          <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2 }}>
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoFocus
                value={credentials.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Chip label="OR" size="small" />
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Admin: admin / admin123
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Employee: john.smith / password123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
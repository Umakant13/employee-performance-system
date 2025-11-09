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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  PersonAdd,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  AdminPanelSettings,
  Work,
  Business,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // 0 = Employee, 1 = Admin
  const [formData, setFormData] = useState({
    // Common fields
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Employee specific
    name: '',
    department: '',
    age: '',
    experience: '',
    salary: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const departments = ['IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Employee specific validation
    if (tabValue === 0) {
      if (!formData.name || !formData.department || !formData.age || 
          !formData.experience || !formData.salary) {
        setError('Please fill in all employee information');
        return;
      }
    }

    setLoading(true);

    try {
      if (tabValue === 0) {
        // Employee Signup
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'employee',
          name: formData.name,
          department: formData.department,
          age: parseInt(formData.age),
          experience: parseInt(formData.experience),
          salary: parseFloat(formData.salary),
        };

        await authAPI.register(userData);

        navigate('/login', {
          state: {
            message: `Employee account created successfully! You can now login with username: ${formData.username}`,
          },
        });
      } else {
        // Admin Signup
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'admin',
        };

        await authAPI.register(userData);

        navigate('/login', {
          state: {
            message: `Admin account created successfully! You can now login with username: ${formData.username}`,
          },
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(
        error.response?.data?.detail ||
          'Error creating account. Username or email may already exist.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
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
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
            <PersonAdd sx={{ mr: 2, fontSize: 50, color: 'primary.main' }} />
            <Typography component="h1" variant="h4" fontWeight="bold">
              Create Account
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Employee Signup" icon={<Person />} />
            <Tab label="Admin Signup" icon={<AdminPanelSettings />} />
          </Tabs>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <Grid container spacing={2}>
              {tabValue === 0 && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  helperText="This will be used to login"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText="At least 6 characters"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>

              {/* Employee Specific Fields */}
              {tabValue === 0 && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Employment Information
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        label="Department"
                        startAdornment={
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        }
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      inputProps={{ min: 18, max: 70 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label="Experience (years)"
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleChange}
                      inputProps={{ min: 0, max: 50 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Annual Salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney />
                          </InputAdornment>
                        ),
                      }}
                      helperText="Expected annual salary"
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              {loading ? 'Creating Account...' : `Create ${tabValue === 0 ? 'Employee' : 'Admin'} Account`}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
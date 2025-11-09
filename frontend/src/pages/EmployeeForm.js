/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Person,
  Work,
  Assessment,
  Email,
  Business,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeAPI } from '../services/api';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    age: '',
    experience: '',
    salary: '',
    satisfaction_level: '',
    last_evaluation_score: '',
    project_count: '',
    work_hours: '40',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const departments = ['IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support'];

  useEffect(() => {
    if (isEdit) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const response = await employeeAPI.getById(id);
      const employee = response.data;
      setFormData({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        age: employee.age,
        experience: employee.experience,
        salary: employee.salary,
        satisfaction_level: employee.satisfaction_level || '',
        last_evaluation_score: employee.last_evaluation_score || '',
        project_count: employee.project_count,
        work_hours: employee.work_hours,
      });
    } catch (error) {
      console.error('Error loading employee:', error);
      setSubmitError('Error loading employee data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department) newErrors.department = 'Department is required';

    const age = parseInt(formData.age);
    if (!age || age < 18 || age > 70) {
      newErrors.age = 'Age must be between 18 and 70';
    }

    const experience = parseInt(formData.experience);
    if (experience < 0 || experience > 50) {
      newErrors.experience = 'Experience must be between 0 and 50';
    }

    const salary = parseFloat(formData.salary);
    if (!salary || salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        experience: parseInt(formData.experience),
        salary: parseFloat(formData.salary),
        satisfaction_level: formData.satisfaction_level
          ? parseFloat(formData.satisfaction_level)
          : null,
        last_evaluation_score: formData.last_evaluation_score
          ? parseFloat(formData.last_evaluation_score)
          : null,
        project_count: parseInt(formData.project_count) || 0,
        work_hours: parseInt(formData.work_hours) || 40,
      };

      if (isEdit) {
        await employeeAPI.update(id, submitData);
      } else {
        await employeeAPI.create(submitData);
      }

      navigate('/admin/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      setSubmitError(error.response?.data?.detail || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/employees')}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </Typography>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Person sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Personal Information
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        required
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        error={Boolean(errors.age)}
                        helperText={errors.age || '18-70 years'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        required
                        label="Experience"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        error={Boolean(errors.experience)}
                        helperText={errors.experience || 'Years'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Work color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Employment Details Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Work sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Employment Details
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        select
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        error={Boolean(errors.department)}
                        helperText={errors.department}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Annual Salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        error={Boolean(errors.salary)}
                        helperText={errors.salary || 'Annual salary in USD'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Projects"
                        name="project_count"
                        type="number"
                        value={formData.project_count}
                        onChange={handleChange}
                        helperText="Active projects"
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Work Hours"
                        name="work_hours"
                        type="number"
                        value={formData.work_hours}
                        onChange={handleChange}
                        helperText="Per week"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Metrics Card */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Assessment sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Performance Metrics
                    </Typography>
                    <Chip label="Optional" size="small" sx={{ ml: 2 }} color="info" />
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Satisfaction Level"
                        name="satisfaction_level"
                        type="number"
                        value={formData.satisfaction_level}
                        onChange={handleChange}
                        inputProps={{ min: 0, max: 1, step: 0.01 }}
                        helperText="Range: 0 (Very Unsatisfied) to 1 (Very Satisfied)"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Evaluation Score"
                        name="last_evaluation_score"
                        type="number"
                        value={formData.last_evaluation_score}
                        onChange={handleChange}
                        inputProps={{ min: 0, max: 1, step: 0.01 }}
                        helperText="Range: 0 (Poor) to 1 (Excellent)"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/admin/employees')}
                  disabled={loading}
                  sx={{ px: 4, borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{
                    px: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    },
                  }}
                >
                  {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default EmployeeForm;

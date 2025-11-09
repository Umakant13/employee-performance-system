/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Button,
} from '@mui/material';
import {
  Person,
  TrendingUp,
  Warning,
  Work,
  Star,
  Email,
  Business,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { employeeAPI, feedbackAPI } from '../services/api';
import { format } from 'date-fns';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  if (user) {
    if (user.employee_id) {
      loadEmployeeData();
      loadFeedback();
    } else {
      setError('No employee profile linked to this account. Please contact admin to link your profile.');
      setLoading(false);
    }
  } else {
    setError('Please login to view your dashboard');
    setLoading(false);
  }
}, [user]);


  const loadEmployeeData = async () => {
    try {
      const response = await employeeAPI.getById(user.employee_id);
      setEmployee(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading employee data:', error);
      setError('Unable to load employee data. Please contact admin.');
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async () => {
    try {
      const response = await feedbackAPI.getByEmployee(user.employee_id);
      setFeedback(response.data);
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const getRiskColor = (probability) => {
    if (probability > 0.6) return 'error';
    if (probability > 0.3) return 'warning';
    return 'success';
  };

  const getRiskLabel = (probability) => {
    if (probability > 0.6) return 'High Risk';
    if (probability > 0.3) return 'Medium Risk';
    return 'Low Risk';
  };

  const getPerformanceGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: '#4caf50' };
    if (score >= 80) return { grade: 'A', color: '#8bc34a' };
    if (score >= 70) return { grade: 'B', color: '#ffc107' };
    if (score >= 60) return { grade: 'C', color: '#ff9800' };
    return { grade: 'D', color: '#f44336' };
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>
            Loading your dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          No employee profile found. Please contact your administrator.
        </Alert>
      </Container>
    );
  }

  const performanceGrade = getPerformanceGrade(employee.performance_score || 0);

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome back, {employee.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your performance overview
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Personal Info Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Person sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Personal Information
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Email
                    </Typography>
                    <Typography variant="body2">{employee.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Department
                    </Typography>
                    <Typography variant="body2">{employee.department}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Experience
                    </Typography>
                    <Typography variant="body2">{employee.experience} years</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 2, fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Age
                    </Typography>
                    <Typography variant="body2">{employee.age} years</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Score Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1, color: 'success.main', fontSize: 30 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Performance Score
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', my: 3 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 'bold',
                      color: performanceGrade.color,
                      fontSize: '4rem',
                    }}
                  >
                    {employee.performance_score?.toFixed(1) || 'N/A'}
                  </Typography>
                  <Chip
                    label={`Grade: ${performanceGrade.grade}`}
                    sx={{
                      bgcolor: performanceGrade.color,
                      color: 'white',
                      fontWeight: 'bold',
                      mt: 1,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Out of 100
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={employee.performance_score || 0}
                    sx={{
                      mt: 2,
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: performanceGrade.color,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Satisfaction
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {employee.satisfaction_level
                      ? `${(employee.satisfaction_level * 100).toFixed(0)}%`
                      : 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Last Evaluation
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {employee.last_evaluation_score
                      ? `${(employee.last_evaluation_score * 100).toFixed(0)}%`
                      : 'N/A'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Attrition Risk Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Warning sx={{ mr: 1, color: 'warning.main', fontSize: 30 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Retention Status
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', my: 3 }}>
                  <Chip
                    label={getRiskLabel(employee.attrition_probability)}
                    color={getRiskColor(employee.attrition_probability)}
                    sx={{
                      fontSize: '1.2rem',
                      py: 3,
                      px: 2,
                      fontWeight: 'bold',
                    }}
                  />

                  <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {(employee.attrition_probability * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attrition Probability
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={employee.attrition_probability * 100}
                    color={getRiskColor(employee.attrition_probability)}
                    sx={{ mt: 2, height: 10, borderRadius: 5 }}
                  />
                </Box>

                {employee.attrition_probability > 0.6 && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      We notice you might be at risk. Please reach out to HR for support.
                    </Typography>
                  </Alert>
                )}

                {employee.attrition_probability <= 0.3 && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Great job! You're a valued team member!
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Work Details */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Work sx={{ mr: 1, color: 'info.main', fontSize: 30 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Work Details
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h3" fontWeight="bold">
                        {employee.project_count}
                      </Typography>
                      <Typography variant="body2">Active Projects</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h3" fontWeight="bold">
                        {employee.work_hours}
                      </Typography>
                      <Typography variant="body2">Hours/Week</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Feedback */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ mr: 1, color: 'warning.main', fontSize: 30 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Recent Feedback
                  </Typography>
                </Box>

                {feedback.length > 0 ? (
                  <List>
                    {feedback.slice(0, 3).map((item, index) => (
                      <React.Fragment key={item.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Chip
                                  label={`${item.rating}/5 ⭐`}
                                  size="small"
                                  color="primary"
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {format(new Date(item.feedback_date), 'MMM dd, yyyy')}
                                </Typography>
                              </Box>
                            }
                            secondary={item.comments || 'No comments provided'}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Star sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No feedback yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EmployeeDashboard;
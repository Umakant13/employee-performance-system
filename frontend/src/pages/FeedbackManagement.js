import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  Rating,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Delete, Star, Person } from '@mui/icons-material';
import { employeeAPI, feedbackAPI } from '../services/api';
import { format } from 'date-fns';

const FeedbackManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllFeedback();
  }, []);

  const loadAllFeedback = async () => {
    try {
      // Get all employees
      const empResponse = await employeeAPI.getAll({ limit: 1000 });
      const allEmployees = empResponse.data;

      // Get feedback for each employee
      const allFeedback = [];
      for (const emp of allEmployees) {
        try {
          const fbResponse = await feedbackAPI.getByEmployee(emp.id);
          fbResponse.data.forEach((fb) => {
            allFeedback.push({
              ...fb,
              employeeName: emp.name,
              employeeEmail: emp.email,
              employeeDepartment: emp.department,
            });
          });
        } catch (error) {
          console.log(`No feedback for employee ${emp.id}`);
        }
      }

      setEmployees(allEmployees);
      setFeedbackData(allFeedback.sort((a, b) => 
        new Date(b.feedback_date) - new Date(a.feedback_date)
      ));
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (feedbackData.length === 0) return 0;
    const sum = feedbackData.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / feedbackData.length).toFixed(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Feedback Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          View and manage all employee feedback
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Feedback</Typography>
                </Box>
                <Typography variant="h2" fontWeight="bold">
                  {feedbackData.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ mr: 1 }} />
                  <Typography variant="h6">Average Rating</Typography>
                </Box>
                <Typography variant="h2" fontWeight="bold">
                  {getAverageRating()}/5
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ mr: 1 }} />
                  <Typography variant="h6">Employees Reviewed</Typography>
                </Box>
                <Typography variant="h2" fontWeight="bold">
                  {new Set(feedbackData.map(fb => fb.employee_id)).size}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Feedback Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Comments</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackData.map((feedback) => (
                <TableRow key={feedback.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {feedback.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {feedback.employeeEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={feedback.employeeDepartment} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Rating value={feedback.rating} readOnly size="small" />
                      <Typography variant="caption" display="block">
                        {feedback.rating}/5
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {feedback.comments || 'No comments'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(feedback.feedback_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete Feedback">
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {feedbackData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No feedback available yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default FeedbackManagement;

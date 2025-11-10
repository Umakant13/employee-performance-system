/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import FeedbackModal from '../components/FeedbackModal';
import { Feedback as FeedbackIcon } from '@mui/icons-material';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Alert,
  Tooltip,
  Avatar,
  LinearProgress,
  Slide,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Assessment,
  Search,
  FilterList,
  Close,
  CheckCircle,
  Warning,
  TrendingUp,
  Person,
  Work,
  Email,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { employeeAPI, predictionAPI } from '../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EmployeeList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, employee: null });
  const [predictionDialog, setPredictionDialog] = useState({
    open: false,
    employee: null,
    loading: false,
    result: null,
  });
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    is_active: true,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const departments = ['IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support'];

  useEffect(() => {
    loadEmployees();
  }, [filters]);

  useEffect(() => {
    // Handle navigation filters
    const filter = location.state?.filter;
    if (filter === 'high_risk') {
      // Will filter in frontend after loading
    }
  }, [location.state]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.department) params.department = filters.department;
      if (filters.is_active !== null) params.is_active = filters.is_active;

      const response = await employeeAPI.getAll(params);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const [feedbackDialog, setFeedbackDialog] = useState({
  open: false,
  employee: null,
});

  const handleAddFeedback = (employee) => {
  setFeedbackDialog({
    open: true,
    employee: employee,
  });
};

const closeFeedbackDialog = () => {
  setFeedbackDialog({
    open: false,
    employee: null,
  });
};

const handleFeedbackSuccess = () => {
  // Optionally reload employee list or show success message
  alert('Feedback submitted successfully!');
};

  const handleDelete = async () => {
    try {
      await employeeAPI.delete(deleteDialog.employee.id);
      setDeleteDialog({ open: false, employee: null });
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  const handlePredict = async (employee) => {
    setPredictionDialog({
      open: true,
      employee: employee,
      loading: true,
      result: null,
    });

    try {
      const response = await predictionAPI.predictEmployee(employee.id);
      setPredictionDialog({
        open: true,
        employee: employee,
        loading: false,
        result: response.data,
      });
      loadEmployees(); // Reload to get updated predictions
    } catch (error) {
      console.error('Error predicting:', error);
      alert('Error running prediction');
      setPredictionDialog({ open: false, employee: null, loading: false, result: null });
    }
  };

  const closePredictionDialog = () => {
    setPredictionDialog({ open: false, employee: null, loading: false, result: null });
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

  const getPerformanceColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getPerformanceGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  // Filter employees based on location state
  const filteredEmployees = employees.filter((emp) => {
    const filter = location.state?.filter;
    if (filter === 'high_risk') {
      return emp.attrition_probability > 0.6;
    }
    if (filter === 'top_performers') {
      return emp.performance_score >= 80;
    }
    return true;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Employee Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and predict employee performance & attrition
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/employees/new')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 3,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Add Employee
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Search by name or email"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.is_active}
                  onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                  label="Status"
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                  <MenuItem value={null}>All</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Experience</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Performance</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Attrition Risk</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEmployees.map((employee) => (
                    <TableRow key={employee.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {employee.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {employee.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={employee.department} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{employee.experience} years</TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {employee.performance_score
                                ? employee.performance_score.toFixed(1)
                                : 'N/A'}
                            </Typography>
                            {employee.performance_score && (
                              <Chip
                                label={getPerformanceGrade(employee.performance_score)}
                                size="small"
                                sx={{
                                  bgcolor: getPerformanceColor(employee.performance_score),
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}
                              />
                            )}
                          </Box>
                          {employee.performance_score && (
                            <LinearProgress
                              variant="determinate"
                              value={employee.performance_score}
                              sx={{
                                mt: 0.5,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getPerformanceColor(employee.performance_score),
                                },
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Chip
                            label={getRiskLabel(employee.attrition_probability)}
                            color={getRiskColor(employee.attrition_probability)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {(employee.attrition_probability * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.is_active ? 'Active' : 'Inactive'}
                          color={employee.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="Edit Employee">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                            {/* ADD THIS - Feedback Button */}
                          <Tooltip title="Add Feedback">
                            <IconButton
                              size="small"
                              sx={{ color: '#43e97b' }}
                              onClick={() => handleAddFeedback(employee)}
                            >
                              <FeedbackIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Run Prediction">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handlePredict(employee)}
                            >
                              <Assessment />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Employee">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, employee })}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No employees found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, employee: null })}
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete <strong>{deleteDialog.employee?.name}</strong>? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialog({ open: false, employee: null })}>
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Single Employee Prediction Dialog */}
        <Dialog
          open={predictionDialog.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={closePredictionDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6" fontWeight="bold">
                {predictionDialog.loading ? 'Running Prediction...' : 'Prediction Results'}
              </Typography>
            </Box>
            <IconButton onClick={closePredictionDialog} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ mt: 3 }}>
            {predictionDialog.loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
                  Analyzing employee data...
                </Typography>
                <LinearProgress sx={{ mt: 2 }} />
              </Box>
            ) : predictionDialog.result ? (
              <>
                {/* Employee Info */}
                <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 60,
                          height: 60,
                          fontSize: '1.5rem',
                        }}
                      >
                        {predictionDialog.employee?.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {predictionDialog.employee?.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Chip
                            icon={<Email />}
                            label={predictionDialog.employee?.email}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<Work />}
                            label={predictionDialog.employee?.department}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Prediction Results */}
                <Grid container spacing={3}>
                  {/* Performance Score */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                        borderRadius: 3,
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 50, mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Performance Score
                      </Typography>
                      <Typography variant="h2" fontWeight="bold">
                        {predictionDialog.result.performance_prediction.toFixed(1)}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Grade:{' '}
                        {getPerformanceGrade(predictionDialog.result.performance_prediction)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={predictionDialog.result.performance_prediction}
                        sx={{
                          mt: 2,
                          height: 10,
                          borderRadius: 5,
                          bgcolor: 'rgba(255,255,255,0.3)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'white',
                          },
                        }}
                      />
                    </Paper>
                  </Grid>

                  {/* Attrition Risk */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background:
                          predictionDialog.result.risk_level === 'High'
                            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            : predictionDialog.result.risk_level === 'Medium'
                            ? 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
                            : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        color: 'white',
                        borderRadius: 3,
                      }}
                    >
                      <Warning sx={{ fontSize: 50, mb: 1 }} />
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Attrition Risk
                      </Typography>
                      <Typography variant="h2" fontWeight="bold">
                        {(predictionDialog.result.attrition_probability * 100).toFixed(1)}%
                      </Typography>
                      <Chip
                        label={predictionDialog.result.risk_level}
                        sx={{
                          mt: 1,
                          bgcolor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                      <LinearProgress
                        variant="determinate"
                        value={predictionDialog.result.attrition_probability * 100}
                        sx={{
                          mt: 2,
                          height: 10,
                          borderRadius: 5,
                          bgcolor: 'rgba(255,255,255,0.3)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'white',
                          },
                        }}
                      />
                    </Paper>
                  </Grid>

                  {/* Prediction Details */}
                  <Grid item xs={12}>
                    <Alert
                      severity={
                        predictionDialog.result.attrition_prediction === 'Y'
                          ? 'warning'
                          : 'success'
                      }
                      sx={{ borderRadius: 2 }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {predictionDialog.result.attrition_prediction === 'Y'
                          ? '⚠️ Employee is likely to leave'
                          : '✅ Employee is likely to stay'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {predictionDialog.result.risk_level === 'High' &&
                          'Immediate action recommended. Schedule a meeting to discuss concerns and retention strategies.'}
                        {predictionDialog.result.risk_level === 'Medium' &&
                          'Monitor closely. Consider check-in meetings and career development opportunities.'}
                        {predictionDialog.result.risk_level === 'Low' &&
                          'Employee is satisfied and engaged. Continue current management approach.'}
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              </>
            ) : null}
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={closePredictionDialog} variant="outlined" size="large">
              Close
            </Button>
            {predictionDialog.result && (
              <Button
                onClick={() => {
                  navigate(`/admin/employees/edit/${predictionDialog.employee.id}`);
                  closePredictionDialog();
                }}
                variant="contained"
                size="large"
                startIcon={<Edit />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Edit Employee
              </Button>
            )}
          </DialogActions>
        </Dialog>

              {/* Feedback Modal */}
<FeedbackModal
  open={feedbackDialog.open}
  onClose={closeFeedbackDialog}
  employee={feedbackDialog.employee}
  onSuccess={handleFeedbackSuccess}
/>
      </Container>
    </Box>
  );
};

export default EmployeeList;

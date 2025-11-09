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
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Fade,
  Slide,
  IconButton,
  Chip,
} from '@mui/material';
import {
  People,
  TrendingUp,
  Warning,
  CheckCircle,
  PlayArrow,
  Close,
  Visibility,
  Assessment,
  EmojiEvents,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { employeeAPI, predictionAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import WelcomeTutorial from '../components/WelcomeTutorial';

const COLORS = {
  high: '#f44336',
  medium: '#ff9800',
  low: '#4caf50',
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [predictionDialog, setPredictionDialog] = useState({
    open: false,
    type: null,
    result: null,
  });

  useEffect(() => {
    loadStats();
    
    // Check if tutorial should be shown
    const tutorialCompleted = localStorage.getItem('tutorial_completed');
    if (!tutorialCompleted) {
      // Show tutorial after a small delay
      setTimeout(() => {
        setShowTutorial(true);
      }, 500);
    }
  }, []);

  const loadStats = async () => {
    try {
      const response = await employeeAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPredict = async () => {
    setPredicting(true);
    try {
      const response = await predictionAPI.predictBatch();
      setPredictionDialog({
        open: true,
        type: 'batch',
        result: response.data,
      });
      await loadStats();
    } catch (error) {
      console.error('Error running predictions:', error);
      alert('Error running predictions');
    } finally {
      setPredicting(false);
    }
  };

  const closePredictionDialog = () => {
    setPredictionDialog({ open: false, type: null, result: null });
  };

  const viewHighRiskEmployees = () => {
    navigate('/admin/employees', { state: { filter: 'high_risk' } });
    closePredictionDialog();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  const riskData = [
    { name: 'High Risk', value: stats?.attrition_risk.high || 0, color: COLORS.high },
    { name: 'Medium Risk', value: stats?.attrition_risk.medium || 0, color: COLORS.medium },
    { name: 'Low Risk', value: stats?.attrition_risk.low || 0, color: COLORS.low },
  ];

  const totalRisk = stats?.attrition_risk.high + stats?.attrition_risk.medium + stats?.attrition_risk.low || 1;

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
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
              Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overview of employee performance and attrition risk
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => setShowTutorial(true)}
              startIcon={<Assessment />}
            >
              Show Guide
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={predicting ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
              onClick={handleBatchPredict}
              disabled={predicting}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              {predicting ? 'Running Predictions...' : 'Run Batch Prediction'}
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={500}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ fontSize: 40, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Total Employees
                    </Typography>
                  </Box>
                  <Typography variant="h2" fontWeight="bold">
                    {stats?.total_employees || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    Active in system
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={700}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(245, 87, 108, 0.3)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Warning sx={{ fontSize: 40, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      High Risk
                    </Typography>
                  </Box>
                  <Typography variant="h2" fontWeight="bold">
                    {stats?.attrition_risk.high || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    {((stats?.attrition_risk.high / totalRisk) * 100).toFixed(1)}% of total
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={900}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ fontSize: 40, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Avg Performance
                    </Typography>
                  </Box>
                  <Typography variant="h2" fontWeight="bold">
                    {stats?.averages.performance?.toFixed(1) || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    Out of 100
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={1100}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ fontSize: 40, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Avg Satisfaction
                    </Typography>
                  </Box>
                  <Typography variant="h2" fontWeight="bold">
                    {((stats?.averages.satisfaction || 0) * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    Employee satisfaction
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Attrition Risk Pie Chart */}
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Attrition Risk Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                {riskData.map((item) => (
                  <Box key={item.name} sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: item.color,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color={item.color}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Department Distribution Bar Chart */}
          <Grid item xs={12} lg={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Department Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats?.department_distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<People />}
                    onClick={() => navigate('/admin/employees')}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#764ba2',
                        bgcolor: 'rgba(102, 126, 234, 0.05)',
                      },
                    }}
                  >
                    View All Employees
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Warning />}
                    onClick={viewHighRiskEmployees}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderColor: '#f44336',
                      color: '#f44336',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        bgcolor: 'rgba(244, 67, 54, 0.05)',
                      },
                    }}
                  >
                    High Risk Employees
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Assessment />}
                    onClick={() => navigate('/admin/analytics')}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderColor: '#4facfe',
                      color: '#4facfe',
                      '&:hover': {
                        borderColor: '#00f2fe',
                        bgcolor: 'rgba(79, 172, 254, 0.05)',
                      },
                    }}
                  >
                    View Analytics
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<EmojiEvents />}
                    onClick={() =>
                      navigate('/admin/employees', { state: { filter: 'top_performers' } })
                    }
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      borderColor: '#43e97b',
                      color: '#43e97b',
                      '&:hover': {
                        borderColor: '#38f9d7',
                        bgcolor: 'rgba(67, 233, 123, 0.05)',
                      },
                    }}
                  >
                    Top Performers
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Prediction Results Dialog */}
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
              <CheckCircle sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6" fontWeight="bold">
                Batch Prediction Completed
              </Typography>
            </Box>
            <IconButton onClick={closePredictionDialog} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ mt: 3 }}>
            {predictionDialog.result && (
              <>
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': { fontSize: 30 },
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {predictionDialog.result.message}
                  </Typography>
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        borderRadius: 2,
                      }}
                    >
                      <Warning sx={{ fontSize: 50, mb: 1 }} />
                      <Typography variant="h3" fontWeight="bold">
                        {stats?.attrition_risk.high || 0}
                      </Typography>
                      <Typography variant="body1">High Risk</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                        color: 'white',
                        borderRadius: 2,
                      }}
                    >
                      <Warning sx={{ fontSize: 50, mb: 1 }} />
                      <Typography variant="h3" fontWeight="bold">
                        {stats?.attrition_risk.medium || 0}
                      </Typography>
                      <Typography variant="body1">Medium Risk</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        color: 'white',
                        borderRadius: 2,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 50, mb: 1 }} />
                      <Typography variant="h3" fontWeight="bold">
                        {stats?.attrition_risk.low || 0}
                      </Typography>
                      <Typography variant="body1">Low Risk</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Prediction Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {predictionDialog.result.updated_count} employees analyzed
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={closePredictionDialog} variant="outlined" size="large">
              Close
            </Button>
            <Button
              onClick={viewHighRiskEmployees}
              variant="contained"
              size="large"
              startIcon={<Visibility />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              View High Risk Employees
            </Button>
          </DialogActions>
        </Dialog>

        {/* Welcome Tutorial */}
        <WelcomeTutorial open={showTutorial} onClose={() => setShowTutorial(false)} />
      </Container>
    </Box>
  );
};

export default AdminDashboard;
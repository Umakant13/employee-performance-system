/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, People, AttachMoney, Assessment } from '@mui/icons-material';
import { employeeAPI } from '../services/api';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#ffd89b', '#ff6b6b'];

const Analytics = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await employeeAPI.getAll({ limit: 1000 });
      console.log('Loaded employees:', response.data); // Debug
      setEmployees(response.data);
      
      if (response.data.length === 0) {
        setError('No employee data available. Please add employees first.');
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Failed to load employee data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEmployees = () => {
    if (selectedDept === 'all') return employees;
    return employees.filter((emp) => emp.department === selectedDept);
  };

  // Performance vs Experience
  const getPerformanceVsExperience = () => {
    const filtered = getFilteredEmployees().filter((emp) => emp.performance_score);
    console.log('Performance data:', filtered); // Debug
    return filtered.map((emp) => ({
      experience: emp.experience,
      performance: emp.performance_score,
      name: emp.name,
    }));
  };

  // Salary distribution by department
  const getSalaryByDept = () => {
    const deptData = {};
    employees.forEach((emp) => {
      if (!deptData[emp.department]) {
        deptData[emp.department] = { total: 0, count: 0 };
      }
      deptData[emp.department].total += emp.salary;
      deptData[emp.department].count += 1;
    });

    const result = Object.keys(deptData).map((dept) => ({
      department: dept,
      avgSalary: Math.round(deptData[dept].total / deptData[dept].count),
    }));
    
    console.log('Salary data:', result); // Debug
    return result;
  };

  // Attrition risk by department
  const getAttritionByDept = () => {
    const deptData = {};
    employees.forEach((emp) => {
      if (!deptData[emp.department]) {
        deptData[emp.department] = { high: 0, medium: 0, low: 0 };
      }
      if (emp.attrition_probability > 0.6) {
        deptData[emp.department].high += 1;
      } else if (emp.attrition_probability > 0.3) {
        deptData[emp.department].medium += 1;
      } else {
        deptData[emp.department].low += 1;
      }
    });

    const result = Object.keys(deptData).map((dept) => ({
      department: dept,
      high: deptData[dept].high,
      medium: deptData[dept].medium,
      low: deptData[dept].low,
    }));
    
    console.log('Attrition data:', result); // Debug
    return result;
  };

  // Performance distribution
  const getPerformanceDistribution = () => {
    const bins = {
      '0-20': 0,
      '20-40': 0,
      '40-60': 0,
      '60-80': 0,
      '80-100': 0,
    };

    getFilteredEmployees().forEach((emp) => {
      const score = emp.performance_score || 0;
      if (score < 20) bins['0-20'] += 1;
      else if (score < 40) bins['20-40'] += 1;
      else if (score < 60) bins['40-60'] += 1;
      else if (score < 80) bins['60-80'] += 1;
      else bins['80-100'] += 1;
    });

    const result = Object.keys(bins).map((range) => ({
      range,
      count: bins[range],
    }));
    
    console.log('Performance distribution:', result); // Debug
    return result;
  };

  // Department metrics for radar chart
  const getDepartmentMetrics = () => {
    const deptMetrics = {};

    employees.forEach((emp) => {
      if (!deptMetrics[emp.department]) {
        deptMetrics[emp.department] = {
          performance: [],
          satisfaction: [],
          evaluation: [],
        };
      }
      if (emp.performance_score)
        deptMetrics[emp.department].performance.push(emp.performance_score);
      if (emp.satisfaction_level)
        deptMetrics[emp.department].satisfaction.push(emp.satisfaction_level * 100);
      if (emp.last_evaluation_score)
        deptMetrics[emp.department].evaluation.push(emp.last_evaluation_score * 100);
    });

    const result = Object.keys(deptMetrics).map((dept) => ({
      department: dept,
      Performance:
        deptMetrics[dept].performance.length > 0
          ? deptMetrics[dept].performance.reduce((a, b) => a + b, 0) /
            deptMetrics[dept].performance.length
          : 0,
      Satisfaction:
        deptMetrics[dept].satisfaction.length > 0
          ? deptMetrics[dept].satisfaction.reduce((a, b) => a + b, 0) /
            deptMetrics[dept].satisfaction.length
          : 0,
      Evaluation:
        deptMetrics[dept].evaluation.length > 0
          ? deptMetrics[dept].evaluation.reduce((a, b) => a + b, 0) /
            deptMetrics[dept].evaluation.length
          : 0,
    }));
    
    console.log('Department metrics:', result); // Debug
    return result;
  };

  const departments = [...new Set(employees.map((emp) => emp.department))];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || employees.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          {error || 'No employee data available. Please add employees and run predictions first.'}
        </Alert>
      </Container>
    );
  }

  const filteredEmployees = getFilteredEmployees();
  const avgPerformance =
    filteredEmployees.filter(emp => emp.performance_score).length > 0
      ? filteredEmployees.reduce((sum, emp) => sum + (emp.performance_score || 0), 0) /
        filteredEmployees.filter(emp => emp.performance_score).length
      : 0;
  const avgSatisfaction =
    filteredEmployees.filter(emp => emp.satisfaction_level).length > 0
      ? filteredEmployees.reduce((sum, emp) => sum + (emp.satisfaction_level || 0), 0) /
        filteredEmployees.filter(emp => emp.satisfaction_level).length
      : 0;
  const avgSalary =
    filteredEmployees.length > 0
      ? filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0) / filteredEmployees.length
      : 0;

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
              Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed insights and trends analysis
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Department Filter</InputLabel>
            <Select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              label="Department Filter"
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Employees</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {filteredEmployees.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Performance</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {avgPerformance.toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assessment sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Satisfaction</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {(avgSatisfaction * 100).toFixed(0)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Salary</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  ${Math.round(avgSalary).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Performance vs Experience Scatter */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Performance vs Experience
              </Typography>
              {getPerformanceVsExperience().length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="experience" name="Experience" unit=" yrs" />
                    <YAxis dataKey="performance" name="Performance" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                      }}
                    />
                    <Scatter name="Employees" data={getPerformanceVsExperience()} fill="#667eea" />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No performance data available. Run predictions first.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Performance Distribution */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Performance Score Distribution
              </Typography>
              {getPerformanceDistribution().some(d => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getPerformanceDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {getPerformanceDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No performance data available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Average Salary by Department */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Average Salary by Department
              </Typography>
              {getSalaryByDept().length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getSalaryByDept()}>
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
                    <Bar dataKey="avgSalary" name="Avg Salary" radius={[8, 8, 0, 0]}>
                      {getSalaryByDept().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">No salary data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Attrition Risk by Department */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Attrition Risk by Department
              </Typography>
              {getAttritionByDept().length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getAttritionByDept()}>
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
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill="#f44336" name="High Risk" />
                    <Bar dataKey="medium" stackId="a" fill="#ff9800" name="Medium Risk" />
                    <Bar dataKey="low" stackId="a" fill="#4caf50" name="Low Risk" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No attrition data available. Run predictions first.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Department Metrics Radar */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Department Performance Metrics
              </Typography>
              {getDepartmentMetrics().length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={getDepartmentMetrics()}>
                    <PolarGrid stroke="#f0f0f0" />
                    <PolarAngleAxis dataKey="department" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="Performance"
                      stroke="#667eea"
                      fill="#667eea"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Satisfaction"
                      dataKey="Satisfaction"
                      stroke="#43e97b"
                      fill="#43e97b"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Evaluation"
                      dataKey="Evaluation"
                      stroke="#4facfe"
                      fill="#4facfe"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No department metrics available
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Analytics;
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import {
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  School,
  PlayArrow,
  CheckCircle,
  People,
  Assessment,
  TrendingUp,
  Warning,
  NavigateNext,
  NavigateBefore,
  Close,
} from '@mui/icons-material';

const WelcomeTutorial = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'Welcome to Employee Performance System',
      icon: <School />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            This AI-powered system helps you manage employees, predict performance, and prevent
            attrition.
          </Typography>
          <Card sx={{ bgcolor: 'primary.light', color: 'white', mt: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🎯 Key Features
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employee Management"
                    secondary="Add, edit, and track all employee information"
                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="AI Predictions"
                    secondary="Predict who might leave and their performance scores"
                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Analytics Dashboard"
                    secondary="Visual insights and trends analysis"
                    secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.8)' } }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      ),
    },
    {
      label: 'Step 1: Add Employees',
      icon: <People />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Start by adding employees to the system.
          </Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                How to Add an Employee:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Chip label="1" color="primary" size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Click 'Employees' in the menu" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Chip label="2" color="primary" size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Click 'Add Employee' button" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Chip label="3" color="primary" size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Fill in employee details (name, email, department, etc.)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Chip label="4" color="primary" size="small" />
                  </ListItemIcon>
                  <ListItemText primary="Click 'Save' to create the employee" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <Box
            sx={{
              bgcolor: 'info.light',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'info.main',
            }}
          >
            <Typography variant="body2" color="info.dark">
              💡 <strong>Tip:</strong> A user account will be automatically created for each
              employee so they can log in and view their dashboard.
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      label: 'Step 2: Run Predictions',
      icon: <Assessment />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Use AI to predict employee attrition risk and performance.
          </Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Two Ways to Predict:
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip label="Option 1: Single Employee" color="primary" sx={{ mb: 1 }} />
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Go to Employee List"
                      secondary="Click the 🔮 predict button next to any employee"
                    />
                  </ListItem>
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Chip label="Option 2: Batch Prediction" color="secondary" sx={{ mb: 1 }} />
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Go to Dashboard"
                      secondary="Click 'Run Batch Prediction' to analyze all employees at once"
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
          <Box
            sx={{
              bgcolor: 'warning.light',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'warning.main',
            }}
          >
            <Typography variant="body2" color="warning.dark">
              ⚠️ <strong>Important:</strong> Run predictions regularly (weekly recommended) to
              keep data fresh and spot trends early.
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      label: 'Step 3: Understand Results',
      icon: <TrendingUp />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Learn what the predictions mean and how to take action.
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: '#f44336', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Warning sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      High Risk (60-100%)
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Employee is likely to leave. Take immediate action within 1 week.
                  </Typography>
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Typography variant="caption" display="block">
                      • Schedule 1-on-1 meeting
                    </Typography>
                    <Typography variant="caption" display="block">
                      • Discuss concerns and career goals
                    </Typography>
                    <Typography variant="caption" display="block">
                      • Consider salary increase or promotion
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ bgcolor: '#ff9800', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Warning sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Medium Risk (30-60%)
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Monitor closely. Check in within 1 month.
                  </Typography>
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Typography variant="caption" display="block">
                      • Regular check-ins
                    </Typography>
                    <Typography variant="caption" display="block">
                      • Provide career development opportunities
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Low Risk (0-30%)
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Employee is satisfied. Continue current approach.
                  </Typography>
                  <Box sx={{ mt: 1, pl: 2 }}>
                    <Typography variant="caption" display="block">
                      • Quarterly reviews
                    </Typography>
                    <Typography variant="caption" display="block">
                      • Maintain engagement
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      label: 'Step 4: View Analytics',
      icon: <TrendingUp />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Access detailed insights and trends in the Analytics dashboard.
          </Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Available Analytics:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Performance vs Experience"
                    secondary="See how performance correlates with experience"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department Analysis"
                    secondary="Compare metrics across different departments"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Salary Distribution"
                    secondary="Analyze compensation trends"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Risk Analysis"
                    secondary="View attrition risk by department"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <Box
            sx={{
              bgcolor: 'success.light',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'success.main',
            }}
          >
            <Typography variant="body2" color="success.dark">
              ✅ <strong>Best Practice:</strong> Review analytics monthly to identify trends and
              make data-driven decisions.
            </Typography>
          </Box>
        </Box>
      ),
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    localStorage.setItem('tutorial_completed', 'true');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
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
          <School sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h6" fontWeight="bold">
            Quick Start Guide
          </Typography>
        </Box>
        {activeStep === steps.length - 1 && (
          <Button
            startIcon={<Close />}
            onClick={handleFinish}
            sx={{ color: 'white' }}
            size="small"
          >
            Skip
          </Button>
        )}
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                      color: 'white',
                    }}
                  >
                    {step.icon}
                  </Box>
                )}
              >
                <Typography variant="h6" fontWeight="bold">
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>{step.content}</Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<NavigateBefore />}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleFinish}
            startIcon={<CheckCircle />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 3,
            }}
          >
            Get Started
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<NavigateNext />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeTutorial;
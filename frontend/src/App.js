import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Analytics from './pages/Analytics';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
});

// Layout wrapper to conditionally show navbar
function Layout({ children }) {
  const location = useLocation();
  const publicRoutes = ['/login', '/signup'];
  const showNavbar = !publicRoutes.includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavbar && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute adminOnly>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/employees"
                element={
                  <PrivateRoute adminOnly>
                    <EmployeeList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/employees/new"
                element={
                  <PrivateRoute adminOnly>
                    <EmployeeForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/employees/edit/:id"
                element={
                  <PrivateRoute adminOnly>
                    <EmployeeForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <PrivateRoute adminOnly>
                    <Analytics />
                  </PrivateRoute>
                }
              />

              {/* Employee Routes */}
              <Route
                path="/employee/dashboard"
                element={
                  <PrivateRoute>
                    <EmployeeDashboard />
                  </PrivateRoute>
                }
              />

              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
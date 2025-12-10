import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Drawer,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// Import your components
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import WorkoutLogger from './components/workouts/WorkoutLogger';
import MealPlanner from './components/nutrition/MealPlanner';
import ProgressCharts from './components/progress/ProgressCharts';
import UserProfile from './components/profile/UserProfile';
import ExerciseLibrary from './components/library/ExerciseLibrary';
import GoalTracker from './components/goals/GoalTracker';
import { authAPI } from './services/api';
import { checkAuthStatus } from './utils/auth';

const drawerWidth = 240;

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuthStatus();
      setIsAuthenticated(isAuth);
      setIsLoading(false);

      // Redirect to login if not authenticated and trying to access protected route
      if (!isAuth && !isAuthPage() && location.pathname !== '/') {
        navigate('/login', { state: { from: location.pathname } });
      }
    };

    verifyAuth();
  }, [location, navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('fitnessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if we're on an auth page
  const isAuthPage = () => {
    return ['/', '/login', '/register'].includes(location.pathname);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Workout Logger', icon: <FitnessCenterIcon />, path: '/workout-logger' },
    { text: 'Meal Planner', icon: <RestaurantIcon />, path: '/meal-planner' },
    { text: 'Progress Charts', icon: <ShowChartIcon />, path: '/progress-charts' },
    { text: 'Exercise Library', icon: <MenuBookIcon />, path: '/library' },
    { text: 'Goal Tracker', icon: <TrackChangesIcon />, path: '/goals' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!isAuthPage() && (
        <>
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                  Fitness Tracker
                </Typography>
              </Box>
              {isAuthenticated && (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Toolbar>
          </AppBar>

          {/* Add the Drawer components */}
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            {/* Mobile drawer */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth 
                },
              }}
            >
              {drawer}
            </Drawer>
            
            {/* Desktop drawer */}
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth 
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
        </>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: isAuthPage() ? 0 : `${drawerWidth}px` },
          mt: isAuthPage() ? 0 : '64px',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/register" 
            element={<Register setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route 
            path="/login" 
            element={<Login setIsAuthenticated={setIsAuthenticated} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/workout-logger"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WorkoutLogger />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/meal-planner" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MealPlanner />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/progress-charts" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProgressCharts />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ExerciseLibrary />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/goals" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <GoalTracker />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
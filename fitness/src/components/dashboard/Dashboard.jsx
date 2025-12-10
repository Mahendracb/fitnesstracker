import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  LinearProgress,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RestaurantIcon from '@mui/icons-material/Restaurant';

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardImages = {
    workouts: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    calories: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    weekly: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
    active: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80"
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setStats({
        todayWorkouts: 2,
        calories: 1850,
        weeklyWorkouts: 4,
        activeMinutes: 145,
        recentMeals: [
          { name: 'Breakfast', calories: 450 },
          { name: 'Lunch', calories: 650 },
          { name: 'Snack', calories: 200 }
        ]
      });
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const quickStats = [
    {
      title: "Today's Workouts",
      value: stats?.todayWorkouts || '0',
      target: '3',
      progress: (stats?.todayWorkouts / 3) * 100 || 0,
      icon: <FitnessCenterIcon />,
      image: cardImages.workouts,
      color: '#FF4081'
    },
    {
      title: "Today's Calories",
      value: stats?.calories || '0',
      target: "2,000",
      progress: (stats?.calories / 2000) * 100 || 0,
      icon: <WhatshotIcon />,
      image: cardImages.calories,
      color: '#FF5722'
    },
    {
      title: "Weekly Workouts",
      value: stats?.weeklyWorkouts || '0',
      target: "5",
      progress: (stats?.weeklyWorkouts / 5) * 100 || 0,
      icon: <FitnessCenterIcon />,
      image: cardImages.weekly,
      color: '#2196F3'
    },
    {
      title: "Active Minutes",
      value: stats?.activeMinutes || '0',
      target: "150",
      progress: (stats?.activeMinutes / 150) * 100 || 0,
      icon: <DirectionsRunIcon />,
      image: cardImages.active,
      color: '#4CAF50'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Fitness Dashboard
        </Typography>

        <Grid container spacing={3}>
          {quickStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={stat.image}
                  alt={stat.title}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      mr: 1, 
                      p: 1, 
                      borderRadius: '50%', 
                      bgcolor: `${stat.color}20`
                    }}>
                      {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                    </Box>
                    <Typography variant="h6" component="div">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(stat.progress, 100)} 
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: `${stat.color}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: stat.color,
                            borderRadius: 5,
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Target: {stat.target}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Recent Meals Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Today's Meals
              </Typography>
              <Grid container spacing={2}>
                {stats?.recentMeals?.map((meal, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{ bgcolor: 'background.default' }}>
                      <CardContent>
                        <Typography variant="subtitle1">{meal.name}</Typography>
                        <Typography variant="h6" color="primary">
                          {meal.calories} cal
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
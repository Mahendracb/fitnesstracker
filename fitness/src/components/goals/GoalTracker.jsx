import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Paper, Typography, Button, 
  Dialog, TextField, MenuItem, CircularProgress,
  IconButton, Alert, Snackbar, Grid, LinearProgress,
  Card, CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import { goalsAPI } from '../../services/api';

// Add these background images
const backgrounds = {
  main: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  categoryImages: {
    weight: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    cardio: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    strength: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
  }
};

function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    current: '',
    category: 'weight',
    unit: 'kg',
    end_date: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalsAPI.getAllGoals();
      setGoals(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (goal = null) => {
    if (goal) {
      setEditGoal(goal);
      setFormData({
        title: goal.title,
        description: goal.description,
        target: goal.target,
        current: goal.current,
        category: goal.category,
        unit: goal.unit,
        end_date: goal.end_date
      });
    } else {
      setEditGoal(null);
      setFormData({
        title: '',
        description: '',
        target: '',
        current: '',
        category: 'weight',
        unit: 'kg',
        end_date: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditGoal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.target || !formData.end_date) {
        setError('Title, target value and end date are required');
        return;
      }

      // Format the goal data
      const goalData = {
        ...formData,
        target: parseFloat(formData.target),
        current: parseFloat(formData.current) || 0,
        start_date: new Date().toISOString().split('T')[0], // Today's date
        end_date: new Date(formData.end_date).toISOString().split('T')[0],
        status: 'not_started'
      };

      if (editGoal) {
        await goalsAPI.updateGoal(editGoal.id, goalData);
        setSnackbarMessage('Goal updated successfully');
      } else {
        await goalsAPI.createGoal(goalData);
        setSnackbarMessage('New goal created successfully');
      }
      
      await fetchGoals();
      handleClose();
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
    } catch (err) {
      console.error('Error saving goal:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to save goal';
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await goalsAPI.deleteGoal(id);
      fetchGoals();
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  };

  // Add categories
  const categories = [
    { value: 'weight', label: 'Weight Management' },
    { value: 'cardio', label: 'Cardio Fitness' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'nutrition', label: 'Nutrition' }
  ];

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgrounds.main})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                <FlagIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                Fitness Goals
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => handleOpen()}
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                }}
              >
                Add New Goal
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {goals.map((goal) => (
                <Grid item xs={12} sm={6} md={4} key={goal.id}>
                  <Card 
                    elevation={3}
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                      background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgrounds.categoryImages[goal.category]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {goal.title}
                      </Typography>
                      <Typography color="textSecondary" sx={{ mb: 2 }}>
                        {goal.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2">
                            {goal.current} / {goal.target} {goal.unit}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateProgress(goal.current, goal.target)}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                              borderRadius: 5,
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <IconButton 
                          onClick={() => handleOpen(goal)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(goal.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Update the Dialog component */}
        <Dialog 
          open={open} 
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: { xs: '90%', sm: '500px' }
            }
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              {editGoal ? 'Edit Goal' : 'New Goal'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target"
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: e.target.value})}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current"
                  type="number"
                  value={formData.current}
                  onChange={(e) => setFormData({...formData, current: e.target.value})}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                onClick={handleClose} 
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                }}
              >
                Save Goal
              </Button>
            </Box>
          </Box>
        </Dialog>

        <Snackbar 
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default GoalTracker;
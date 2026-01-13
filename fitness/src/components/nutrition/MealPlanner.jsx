import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  LocalDining as LocalDiningIcon
} from '@mui/icons-material';
import { nutritionAPI } from '../../services/api';

// Add background images
const backgrounds = {
  main: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  mealTypes: {
    Breakfast: "https://images.unsplash.com/photo-1533089860892-a71c7c2fbf02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    Lunch: "https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    Dinner: "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    Snack: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
  }
};

function MealPlanner() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [formData, setFormData] = useState({
    food: '',
    calories: '',
    mealType: 'Breakfast',
    notes: ''
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await nutritionAPI.getMeals();
      setMeals(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch meals');
      console.error('Error fetching meals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (meal = null) => {
    if (meal) {
      setEditingMeal(meal);
      setFormData({
        food: meal.food,
        calories: meal.calories,
        mealType: meal.meal_type,
        notes: meal.notes || ''
      });
    } else {
      setEditingMeal(null);
      setFormData({
        food: '',
        calories: '',
        mealType: 'Breakfast',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMeal(null);
    setFormData({
      food: '',
      calories: '',
      mealType: 'Breakfast',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.food || !formData.calories || !formData.mealType) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const mealData = {
        food: formData.food,
        calories: parseInt(formData.calories),
        meal_type: formData.mealType, // Changed mealType to meal_type to match backend
        date: new Date().toISOString().split('T')[0],
        notes: formData.notes || ''
      };

      if (editingMeal) {
        await nutritionAPI.updateMeal(editingMeal.id, mealData);
      } else {
        await nutritionAPI.createMeal(mealData);
      }
      fetchMeals();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving meal:', err);
      setError(err.response?.data?.detail || 'Failed to save meal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await nutritionAPI.deleteMeal(id);
        fetchMeals();
      } catch (err) {
        setError('Failed to delete meal');
        console.error('Error deleting meal:', err);
      }
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        pt: 4,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <RestaurantIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Meal Planner
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            sx={{
              mb: 4,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 15px rgba(254, 107, 139, 0.3)',
              },
              transition: 'all 0.3s ease'
            }}
            startIcon={<LocalDiningIcon />}
          >
            Add New Meal
          </Button>

          <Grid container spacing={3}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(mealType => (
              <Grid item xs={12} md={6} key={mealType}>
                <Card 
                  elevation={3}
                  sx={{
                    height: '100%',
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgrounds.mealTypes[mealType]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease'
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {mealType}
                    </Typography>
                    <List>
                      {meals
                        .filter(meal => meal.meal_type === mealType)
                        .map(meal => (
                          <ListItem 
                            key={meal.id}
                            sx={{
                              bgcolor: 'background.paper',
                              mb: 1,
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                          >
                            <ListItemText
                              primary={meal.food}
                              secondary={`${meal.calories} calories`}
                              primaryTypographyProps={{
                                fontWeight: 'medium'
                              }}
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                onClick={() => handleOpenDialog(meal)}
                                sx={{ color: 'primary.main' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                onClick={() => handleDelete(meal.id)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              elevation: 24,
              sx: {
                borderRadius: 2,
                bgcolor: 'background.paper'
              }
            }}
          >
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center'
            }}>
              <LocalDiningIcon sx={{ mr: 1 }} />
              {editingMeal ? 'Edit Meal' : 'Add New Meal'}
            </DialogTitle>
            <DialogContent dividers>
              <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Meal Type</InputLabel>
                  <Select
                    value={formData.mealType}
                    label="Meal Type"
                    onChange={e => setFormData({...formData, mealType: e.target.value})}
                  >
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Lunch">Lunch</MenuItem>
                    <MenuItem value="Dinner">Dinner</MenuItem>
                    <MenuItem value="Snack">Snack</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Food"
                  value={formData.food}
                  onChange={e => setFormData({...formData, food: e.target.value})}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Calories"
                  type="number"
                  value={formData.calories}
                  onChange={e => setFormData({...formData, calories: e.target.value})}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white'
                }}
              >
                {editingMeal ? 'Update' : 'Add'} Meal
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
}

export default MealPlanner;
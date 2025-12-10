import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Grid,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format, startOfWeek, addDays } from 'date-fns';
import { workoutAPI } from '../../services/api';
import WorkoutHistory from './WorkoutHistory';

function WorkoutLogger() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Generate week days
  const weekStart = startOfWeek(new Date());
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutAPI.getAllWorkouts();
      // Ensure response.data is an array
      setWorkouts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch workouts');
      console.error('Error fetching workouts:', err);
      setWorkouts([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exercise || !sets || !reps) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        const workoutData = {
            exercise: exercise.trim(),
            sets: parseInt(sets),
            reps: parseInt(reps),
            weight: weight ? parseFloat(weight) : null,
            date: format(selectedDay, 'yyyy-MM-dd'),
            notes: notes?.trim() || null,
            perceived_difficulty: difficulty ? parseInt(difficulty) : null
        };

        if (editWorkout) {
            await workoutAPI.updateWorkout(editWorkout.id, workoutData);
            showNotification('Workout updated successfully');
        } else {
            await workoutAPI.createWorkout(workoutData);
            showNotification('Workout added successfully');
        }

        await fetchWorkouts();
        handleCloseDialog();
    } catch (err) {
        console.error('Error saving workout:', err);
        showNotification(err.response?.data?.detail || 'Failed to save workout', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await workoutAPI.deleteWorkout(id);
      fetchWorkouts(); // Refresh workouts list
      setSnackbarMessage('Workout deleted successfully');
      setSnackbarSeverity('success');
    } catch (err) {
      setError('Failed to delete workout');
      console.error('Error deleting workout:', err);
      setSnackbarMessage('Failed to delete workout');
      setSnackbarSeverity('error');
    }
  };

  const handleOpenDialog = (workout) => {
    if (workout) {
      setEditWorkout(workout);
      setExercise(workout.exercise);
      setSets(workout.sets.toString());
      setReps(workout.reps.toString());
      setWeight(workout.weight ? workout.weight.toString() : '');
      setNotes(workout.notes || '');
      setDifficulty(workout.perceived_difficulty ? workout.perceived_difficulty.toString() : '');
    } else {
      setEditWorkout(null);
      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setNotes('');
      setDifficulty('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Add safe array check before filtering
  const todaysWorkouts = Array.isArray(workouts) 
    ? workouts.filter(w => w.date === format(selectedDay, 'yyyy-MM-dd'))
    : [];

  const getDayWorkouts = (date) => 
    Array.isArray(workouts)
      ? workouts.filter(w => w.date === format(date, 'yyyy-MM-dd')).length
      : 0;

  const tabs = ['Log Workout', "Today's Exercises", 'History'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Workout Logger</Typography>
      
      {/* Week Calendar */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Weekly View
        </Typography>
        <Grid container spacing={2}>
          {weekDays.map((day) => (
            <Grid item xs={12} sm key={day.toString()}>
              <Paper 
                elevation={format(day, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd') ? 3 : 1}
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  bgcolor: format(day, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd') 
                    ? 'primary.main' 
                    : 'background.paper',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
                onClick={() => setSelectedDay(day)}
              >
                <Typography variant="subtitle2" align="center">
                  {format(day, 'EEE')}
                </Typography>
                <Typography variant="h6" align="center">
                  {format(day, 'd')}
                </Typography>
                {getDayWorkouts(day) > 0 && (
                  <Chip 
                    label={`${getDayWorkouts(day)} exercises`}
                    size="small"
                    sx={{ width: '100%', mt: 1 }}
                  />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab} />
        ))}
      </Tabs>

      {currentTab === 0 ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField 
            label="Exercise" 
            value={exercise} 
            onChange={e => setExercise(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField 
                label="Sets" 
                type="number" 
                value={sets} 
                onChange={e => setSets(e.target.value)} 
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Reps" 
                type="number" 
                value={reps} 
                onChange={e => setReps(e.target.value)} 
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ step: "0.1", min: 0 }}
          />
          <TextField
            select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select difficulty</MenuItem>
            <MenuItem value="1">Very Easy</MenuItem>
            <MenuItem value="2">Easy</MenuItem>
            <MenuItem value="3">Moderate</MenuItem>
            <MenuItem value="4">Hard</MenuItem>
            <MenuItem value="5">Very Hard</MenuItem>
          </TextField>
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ mt: 3 }} 
            fullWidth
          >
            Log Workout
          </Button>
        </Box>
      ) : currentTab === 1 ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Exercises for {format(selectedDay, 'MMMM d, yyyy')}
          </Typography>
          {todaysWorkouts.length === 0 ? (
            <Typography color="text.secondary">
              No workouts logged for today. Start by adding one!
            </Typography>
          ) : (
            <List>
              {todaysWorkouts.map((w, index) => (
                <React.Fragment key={w.id}>
                  <ListItem 
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDelete(w.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={w.exercise}
                      secondary={`${w.sets} sets × ${w.reps} reps`}
                    />
                  </ListItem>
                  {index < todaysWorkouts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      ) : (
        <WorkoutHistory />
      )}

      {/* Dialog for adding/editing workouts */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editWorkout ? 'Edit Workout' : 'Add New Workout'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField 
              label="Exercise" 
              value={exercise} 
              onChange={e => setExercise(e.target.value)} 
              fullWidth 
              margin="normal" 
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField 
                  label="Sets" 
                  type="number" 
                  value={sets} 
                  onChange={e => setSets(e.target.value)} 
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  label="Reps" 
                  type="number" 
                  value={reps} 
                  onChange={e => setReps(e.target.value)} 
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Weight (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ step: "0.1", min: 0 }}
            />
            <TextField
              select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="">Select difficulty</MenuItem>
              <MenuItem value="1">Very Easy</MenuItem>
              <MenuItem value="2">Easy</MenuItem>
              <MenuItem value="3">Moderate</MenuItem>
              <MenuItem value="4">Hard</MenuItem>
              <MenuItem value="5">Very Hard</MenuItem>
            </TextField>
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
          >
            {editWorkout ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default WorkoutLogger;
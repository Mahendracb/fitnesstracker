import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Alert, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { format } from 'date-fns';
import { workoutAPI } from '../../services/api';

function WorkoutHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchHistory();
  }, [timeRange]);

  const fetchHistory = async () => {
    try {
      const response = await workoutAPI.getWorkoutHistory({ timeRange });
      setHistory(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching workout history:', err);
      setError('Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const workoutsByExercise = history.reduce((acc, workout) => {
    if (!acc[workout.exercise]) {
      acc[workout.exercise] = [];
    }
    acc[workout.exercise].push(workout);
    return acc;
  }, {});

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Workout History</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {Object.entries(workoutsByExercise).map(([exercise, exerciseWorkouts]) => (
        <Paper key={exercise} sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>{exercise}</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Sets × Reps</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Difficulty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exerciseWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell>{format(new Date(workout.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{workout.sets} × {workout.reps}</TableCell>
                    <TableCell>{workout.weight || '-'} kg</TableCell>
                    <TableCell>
                      {workout.perceived_difficulty && (
                        <Chip 
                          size="small"
                          label={['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'][workout.perceived_difficulty - 1]}
                          color={['success', 'success', 'primary', 'warning', 'error'][workout.perceived_difficulty - 1]}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Box>
  );
}

export default WorkoutHistory;
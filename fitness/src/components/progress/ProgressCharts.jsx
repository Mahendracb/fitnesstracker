import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tab,
  Tabs,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Line,
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format, subDays } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProgressCharts() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    calories: '',
    workouts: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      thighs: ''
    }
  });

  const [progressData, setProgressData] = useState(() => {
    const saved = localStorage.getItem('fitnessProgress');
    return saved ? JSON.parse(saved) : {
      weight: [],
      calories: [],
      workouts: [],
      measurements: []
    };
  });

  useEffect(() => {
    localStorage.setItem('fitnessProgress', JSON.stringify(progressData));
  }, [progressData]);

  const handleAddEntry = () => {
    const newEntry = {
      date: formData.date,
      value: currentTab === 3 ? formData.measurements : 
             currentTab === 0 ? Number(formData.weight) :
             currentTab === 1 ? Number(formData.calories) :
             Number(formData.workouts)
    };

    const key = currentTab === 0 ? 'weight' :
                currentTab === 1 ? 'calories' :
                currentTab === 2 ? 'workouts' : 'measurements';

    setProgressData(prev => ({
      ...prev,
      [key]: [...prev[key], newEntry].sort((a, b) => new Date(a.date) - new Date(b.date))
    }));

    setOpenDialog(false);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      calories: '',
      workouts: '',
      measurements: {
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        thighs: ''
      }
    });
  };

  const handleDeleteEntry = (index, type) => {
    setProgressData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${['Weight', 'Calories', 'Workouts', 'Measurements'][currentTab]} Progress`,
      },
    },
    scales: {
      y: {
        beginAtZero: currentTab === 2, // Only start at zero for workout counts
      },
    },
  };

  const getChartData = (type) => {
    const data = progressData[type];
    if (type === 'measurements') {
      return {
        labels: data.map(entry => format(new Date(entry.date), 'MMM d')),
        datasets: [
          {
            label: 'Chest',
            data: data.map(entry => entry.value.chest),
            borderColor: '#FF6384',
            tension: 0.4
          },
          {
            label: 'Waist',
            data: data.map(entry => entry.value.waist),
            borderColor: '#36A2EB',
            tension: 0.4
          },
          {
            label: 'Hips',
            data: data.map(entry => entry.value.hips),
            borderColor: '#FFCE56',
            tension: 0.4
          },
          {
            label: 'Biceps',
            data: data.map(entry => entry.value.biceps),
            borderColor: '#4BC0C0',
            tension: 0.4
          },
          {
            label: 'Thighs',
            data: data.map(entry => entry.value.thighs),
            borderColor: '#9966FF',
            tension: 0.4
          }
        ]
      };
    }

    return {
      labels: data.map(entry => format(new Date(entry.date), 'MMM d')),
      datasets: [{
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data: data.map(entry => entry.value),
        borderColor: type === 'weight' ? '#FF6384' :
                    type === 'calories' ? '#36A2EB' : '#FFCE56',
        backgroundColor: type === 'workouts' ? '#FFCE56' : undefined,
        tension: 0.4
      }]
    };
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Progress Tracking
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                color: 'white',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)',
                }
              }}
            >
              Add Entry
            </Button>
          </Box>

          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Weight" />
            <Tab label="Calories" />
            <Tab label="Workouts" />
            <Tab label="Measurements" />
          </Tabs>

          <Box sx={{ height: 400, mb: 4 }}>
            {currentTab === 2 ? (
              <Bar data={getChartData('workouts')} options={chartOptions} />
            ) : (
              <Line 
                data={getChartData(
                  currentTab === 0 ? 'weight' :
                  currentTab === 1 ? 'calories' : 'measurements'
                )}
                options={chartOptions}
              />
            )}
          </Box>

          {/* Data Table */}
          <Grid container spacing={2}>
            {(currentTab === 3 ? progressData.measurements : 
              progressData[['weight', 'calories', 'workouts'][currentTab]]
            ).map((entry, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {format(new Date(entry.date), 'MMM d, yyyy')}
                    </Typography>
                    {currentTab === 3 ? (
                      Object.entries(entry.value).map(([key, value]) => (
                        <Typography key={key} variant="body2">
                          {key.charAt(0).toUpperCase() + key.slice(1)}: {value} cm
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body1">
                        {entry.value} {
                          currentTab === 0 ? 'kg' :
                          currentTab === 1 ? 'cal' : 'workouts'
                        }
                      </Typography>
                    )}
                  </Box>
                  <IconButton 
                    onClick={() => handleDeleteEntry(
                      index,
                      ['weight', 'calories', 'workouts', 'measurements'][currentTab]
                    )}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Add Entry Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            Add {['Weight', 'Calories', 'Workouts', 'Measurements'][currentTab]} Entry
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {currentTab === 3 ? (
                Object.keys(formData.measurements).map(key => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      type="number"
                      value={formData.measurements[key]}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: {
                          ...formData.measurements,
                          [key]: e.target.value
                        }
                      })}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={['Weight (kg)', 'Calories', 'Workouts'][currentTab]}
                    type="number"
                    value={formData[['weight', 'calories', 'workouts'][currentTab]]}
                    onChange={(e) => setFormData({
                      ...formData,
                      [['weight', 'calories', 'workouts'][currentTab]]: e.target.value
                    })}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAddEntry}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              }}
            >
              Add Entry
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ProgressCharts;
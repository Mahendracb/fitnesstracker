import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Grid, MenuItem, Typography, Snackbar, Alert, useTheme } from '@mui/material';
import { userAPI } from '../../services/api';

function UserProfile() {
  const theme = useTheme();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitness_goal: '',
    activity_level: '',
    medical_conditions: '',
    dietary_restrictions: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setApiError('Failed to load profile data');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profile.username) newErrors.username = 'Name is required';
    if (!profile.email) newErrors.email = 'Email is required';
    if (profile.age && (isNaN(profile.age) || profile.age < 0)) {
      newErrors.age = 'Please enter a valid age';
    }
    if (profile.weight && (isNaN(profile.weight) || profile.weight < 0)) {
      newErrors.weight = 'Please enter a valid weight';
    }
    if (profile.height && (isNaN(profile.height) || profile.height < 0)) {
      newErrors.height = 'Please enter a valid height';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      const response = await userAPI.updateProfile(profile);
      if (response.status === 200) {
        setShowSuccess(true);
        // Refresh profile data
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      const respData = error.response?.data;
      if (respData && typeof respData === 'object') {
        // Map field errors returned from server (e.g., { username: ['This field is required.'] })
        const mappedErrors = Object.fromEntries(
          Object.entries(respData).map(([k, v]) => [k, Array.isArray(v) ? v.join(' ') : String(v)])
        );
        setErrors(mappedErrors);
      } else {
        setApiError(respData?.message || 'Failed to save profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Profile Settings
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Form fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="username"
                value={profile.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleChange}
                error={!!errors.weight}
                helperText={errors.weight}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                name="height"
                type="number"
                value={profile.height}
                onChange={handleChange}
                error={!!errors.height}
                helperText={errors.height}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Fitness Goal"
                name="fitness_goal"
                value={profile.fitness_goal}
                onChange={handleChange}
              >
                <MenuItem value="lose">Lose Weight</MenuItem>
                <MenuItem value="gain">Gain Muscle</MenuItem>
                <MenuItem value="maintain">Maintain Weight</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Activity Level"
                name="activity_level"
                value={profile.activity_level}
                onChange={handleChange}
              >
                <MenuItem value="sedentary">Sedentary</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="very_active">Very Active</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medical Conditions"
                name="medical_conditions"
                multiline
                rows={2}
                value={profile.medical_conditions}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dietary Restrictions"
                name="dietary_restrictions"
                multiline
                rows={2}
                value={profile.dietary_restrictions}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserProfile;
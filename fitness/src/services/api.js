import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitnessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitnessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  register: async (userData) => {
    try {
      // Updated registration endpoint to match Django's URL pattern
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name || '',
        last_name: userData.last_name || ''
      };

      const response = await api.post('/register/', registrationData);
      
      if (response.status === 201) {
        const loginResponse = await api.post('/token/', {
          username: userData.username,
          password: userData.password
        });
        return {
          registration: response.data,
          auth: loginResponse.data
        };
      }
      
      return response;
    }catch (error) {
  console.error("Registration validation errors:", error.response?.data || error.message);
  setError(
    error.response?.data?.message ||
    JSON.stringify(error.response?.data) ||
    'Registration failed'
  );


    // catch (error) {
    //   if (error.response?.status === 400) {
    //     const errorMessage = error.response.data;
    //     console.error('Registration validation errors:', errorMessage);
        
    //     if (typeof errorMessage === 'object') {
    //       const formattedErrors = Object.entries(errorMessage)
    //         .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    //         .join('\n');
    //       throw new Error(formattedErrors);
    //     }
    //     throw new Error(errorMessage);
    //   }
      
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again later.');
    }
  },
  verifyToken: (token) => api.post('/token/verify/', { token }),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
  logout: () => api.post('/logout/'),
};

export const goalsAPI = {
  getAllGoals: () => api.get('/goals/'),
  getGoal: (id) => api.get(`/goals/${id}/`),
  createGoal: (goalData) => api.post('/goals/', goalData),
  updateGoal: (id, goalData) => api.put(`/goals/${id}/`, goalData),
  deleteGoal: (id) => api.delete(`/goals/${id}/`),
};

export const nutritionAPI = {
  getMeals: () => api.get('/nutrition/meals/'),
  createMeal: (mealData) => api.post('/nutrition/meals/', mealData),
  updateMeal: (id, mealData) => api.put(`/nutrition/meals/${id}/`, mealData),
  deleteMeal: (id) => api.delete(`/nutrition/meals/${id}/`),
};

export const workoutAPI = {
  getAllWorkouts: () => api.get('/workouts/workouts/'),
  createWorkout: (workoutData) => api.post('/workouts/workouts/', workoutData),
  updateWorkout: (id, workoutData) => api.put(`/workouts/workouts/${id}/`, workoutData),
  deleteWorkout: (id) => api.delete(`/workouts/workouts/${id}/`),
  getWorkoutHistory: (params) => api.get('/workouts/workouts/history/', { params }),
  getExerciseStats: (exerciseId) => api.get(`/workouts/workouts/${exerciseId}/stats/`),
};

export const progressAPI = {
  getWeightHistory: () => api.get('/api/progress/progress/weight_history/'),
  getNutritionHistory: () => api.get('/api/progress/progress/nutrition_history/'),
  getWorkoutHistory: () => api.get('/api/progress/progress/workout_history/'),
  getMeasurementHistory: () => api.get('/api/progress/measurements/measurement_history/'),
  addProgress: (data) => api.post('/api/progress/progress/', data),
  updateProgress: (id, data) => api.put(`/api/progress/progress/${id}/`, data),
  deleteProgress: (id) => api.delete(`/api/progress/progress/${id}/`),
};
export const dashboardAPI = {
  getDashboardStats: () => api.get('/dashboard/stats/'),
  getRecentActivity: () => api.get('/dashboard/recent-activity/'),
  getProgressSummary: () => api.get('/dashboard/progress-summary/'),
  getWeeklyProgress: () => api.get('/dashboard/weekly-progress/'),
  getDailyStats: () => api.get('/dashboard/daily-stats/'),
};

// Add userAPI to your existing API services
export const userAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (profileData) => api.put('/users/profile/', profileData),
};


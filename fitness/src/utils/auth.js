import { authAPI } from '../services/api';

export const checkAuthStatus = async () => {
  const token = localStorage.getItem('fitnessToken');
  
  if (!token) {
    return false;
  }

  try {
    await authAPI.verifyToken(token);
    return true;
  } catch (error) {
    // Try to refresh the token
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await authAPI.refreshToken(refreshToken);
        localStorage.setItem('fitnessToken', response.data.access);
        return true;
      } catch (refreshError) {
        localStorage.removeItem('fitnessToken');
        localStorage.removeItem('refreshToken');
        return false;
      }
    }
    return false;
  }
};
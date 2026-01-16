# Fitness Tracker Application - Complete Documentation

## Project Overview
A comprehensive full-stack fitness tracking application built with modern web technologies. The application allows users to monitor their workouts, nutrition, goals, and overall fitness progress with detailed analytics and tracking capabilities.

---

## Project Structure

### Frontend
- **Location**: `fitness/`
- **Framework**: React 19 with Vite
- **Package Manager**: npm

### Backend
- **Location**: `fitnessbackend/`
- **Framework**: Django 5.1.3
- **Database**: SQLite
- **API**: Django REST Framework (DRF)

---

## Core Features

### 1. **Authentication & User Management**
- User Registration
- Login/Logout functionality
- Password management
- JWT token-based authentication
- Protected routes
- User profile customization

**Components:**
- `Login.jsx` - User login page
- `Register.jsx` - User registration page
- `UserProfile.jsx` - Profile management

**Backend Models:**
- User (Extended AbstractUser)
  - Age, Weight, Height
  - Gender, Fitness Goal
  - Activity Level
  - Medical Conditions
  - Dietary Restrictions
  - Date of Birth

---

### 2. **Workout Management**
- Log workout sessions
- Track exercises with sets, reps, and weight
- Browse exercise library
- View workout history
- Weight tracking over time

**Components:**
- `WorkoutLogger.jsx` - Log new workouts
- `WorkoutHistory.jsx` - View past workouts
- `ExerciseLibrary.jsx` - Browse available exercises

**Backend Models:**
- Exercise
  - Exercise name, description
  - Muscle group, equipment
  - Detailed instructions
- Workout
  - User association
  - Exercise details (sets, reps, weight)
  - Date and notes
  - Timestamps
- WeightEntry
  - Daily weight tracking

---

### 3. **Nutrition & Meal Planning**
- Log daily meals
- Track calories and macronutrients (protein, carbs, fats)
- Categorize meals (Breakfast, Lunch, Dinner, Snack)
- View meal history
- Food library management

**Components:**
- `MealPlanner.jsx` - Log and manage meals

**Backend Models:**
- Food
  - Nutritional information (calories, protein, carbs, fats)
  - Serving size
- Meal
  - User association
  - Meal type categorization
  - Calorie tracking
  - Date and notes

---

### 4. **Goal Tracking**
- Create fitness goals
- Set target values with units
- Track progress towards goals
- Multiple goal categories: Weight, Workout, Nutrition, Measurement
- Goal status management (Not Started, In Progress, Completed, Failed)
- Timeline-based goal setting

**Components:**
- `GoalTracker.jsx` - Manage and track fitness goals

**Backend Models:**
- Goal
  - User-specific goals
  - Category-based organization
  - Target and current values
  - Start and end dates
  - Status tracking
  - Timestamps

---

### 5. **Progress Tracking & Analytics**
- Visual progress charts and graphs
- Weight loss/gain trends
- Calorie consumption tracking
- Workout completion statistics
- Body measurements tracking
  - Chest, Waist, Hips
  - Biceps, Thighs
- Daily progress entries

**Components:**
- `ProgressCharts.jsx` - Display analytics and charts

**Backend Models:**
- ProgressEntry
  - Daily tracking (weight, calories, workouts)
- BodyMeasurement
  - Comprehensive body measurements

---

### 6. **Dashboard**
- Centralized overview of all fitness activities
- Quick access to all features
- Key metrics summary
- Navigation hub

**Components:**
- `Dashboard.jsx` - Main dashboard view

---

### 7. **Navigation & Home**
- Landing page
- Responsive navigation drawer
- Mobile-friendly hamburger menu
- Quick links to all features

**Components:**
- `Home.jsx` - Home/landing page

---

## Technology Stack

### Frontend Technologies

#### Core Framework
- **React** (v19.1.1) - UI library
- **React Router DOM** (v7.9.4) - Client-side routing
- **Vite** (v7.1.7) - Build tool and dev server

#### UI & Styling
- **Material-UI (MUI)** (v7.3.4) - Component library
  - `@mui/material` - Core components
  - `@mui/icons-material` (v7.3.4) - Icon library
  - `@emotion/react` (v11.14.0) - CSS-in-JS styling
  - `@emotion/styled` (v11.14.1) - Styled components

#### Data Visualization
- **Chart.js** (v4.5.1) - Charting library
- **react-chartjs-2** (v5.3.0) - React wrapper for Chart.js

#### API Communication
- **Axios** (v1.12.2) - HTTP client for API requests

#### Utilities
- **date-fns** (v4.1.0) - Date manipulation library

#### Development Tools
- **ESLint** (v9.36.0) - Code linting
  - `@eslint/js` - ESLint plugin for JavaScript
  - `eslint-plugin-react-hooks` - React hooks linting
  - `eslint-plugin-react-refresh` - React refresh plugin
- **Vite React Plugin** (@vitejs/plugin-react) - React support for Vite
- **TypeScript** Support (types installed)

---

### Backend Technologies

#### Core Framework
- **Django** (v5.1.3) - Web framework
- **Django REST Framework** - RESTful API development
- **djangorestframework-simplejwt** - JWT authentication

#### Database
- **SQLite** (db.sqlite3) - Database system
- Django ORM - Object-relational mapping

#### Middleware & Extensions
- **django-cors-headers** - CORS support for cross-origin requests
- **Django Admin** - Built-in admin interface

#### Database Apps
- **django.contrib.auth** - User authentication
- **django.contrib.admin** - Admin interface
- **django.contrib.contenttypes** - Content type framework
- **django.contrib.sessions** - Session management
- **django.contrib.messages** - Messaging framework
- **django.contrib.staticfiles** - Static file handling

---

## Project Apps & Modules

### Backend Applications

#### 1. **users** App
- User profile management
- Custom user model with extended fields
- User authentication

#### 2. **workouts** App
- Exercise management
- Workout logging
- Weight tracking
- Workout history

#### 3. **nutrition** App
- Food database
- Meal logging
- Calorie and macro tracking
- Meal categorization

#### 4. **goals** App
- Goal creation and management
- Progress tracking
- Goal status management
- Multi-category goal support

#### 5. **progress** App
- Daily progress entries
- Body measurements
- Progress analytics
- Trend tracking

---

## API Architecture

### Authentication
- JWT Token-based authentication
- Token refresh mechanism
- Login/Logout endpoints

### Endpoints Structure
```
/api/
├── /users/
│   ├── /register/
│   ├── /login/
│   ├── /logout/
│   └── /profile/
├── /workouts/
│   ├── /exercises/
│   ├── /workouts/
│   └── /weight-entries/
├── /nutrition/
│   ├── /foods/
│   └── /meals/
├── /goals/
│   └── /goals/
└── /progress/
    ├── /progress-entries/
    └── /body-measurements/
```

---

## Frontend Components Structure

```
components/
├── auth/
│   ├── Login.jsx
│   └── Register.jsx
├── dashboard/
│   └── Dashboard.jsx
├── goals/
│   └── GoalTracker.jsx
├── home/
│   └── Home.jsx
├── library/
│   └── ExerciseLibrary.jsx
├── nutrition/
│   └── MealPlanner.jsx
├── profile/
│   └── UserProfile.jsx
├── progress/
│   └── ProgressCharts.jsx
└── workouts/
    ├── WorkoutHistory.jsx
    └── WorkoutLogger.jsx

services/
└── api.js (Axios configuration & API calls)

utils/
└── auth.js (Authentication utilities)
```

---

## Key Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint code analysis
- `npm run preview` - Preview production build

### Backend
- `python manage.py runserver` - Start Django server
- `python manage.py migrate` - Run database migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py makemigrations` - Create migrations

---

## Database Schema Overview

### Users Table
- id, username, email, password
- age, weight, height, gender
- fitness_goal, activity_level
- medical_conditions, dietary_restrictions
- date_of_birth

### Workouts Table
- id, user_id, exercise, sets, reps, weight
- date, notes, created_at

### Weight Entries Table
- id, user_id, date, weight

### Exercises Table
- id, name, description, muscle_group
- equipment, instructions

### Meals Table
- id, user_id, food, calories
- meal_type (Breakfast/Lunch/Dinner/Snack)
- date, notes, created_at, updated_at

### Foods Table
- id, name, calories, protein, carbs, fats
- serving_size

### Goals Table
- id, user_id, title, description
- category, target, current, unit
- start_date, end_date, status
- created_at, updated_at

### Progress Entries Table
- id, user_id, date, weight
- calories_consumed, workouts_completed

### Body Measurements Table
- id, user_id, date
- chest, waist, hips, biceps, thighs

---

## Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **CORS Configuration** - Controlled cross-origin requests
3. **Protected Routes** - Frontend route protection for authenticated users
4. **User Isolation** - Users only see their own data
5. **Password Hashing** - Django's built-in password hashing

---

## Responsive Design Features

- Mobile-first approach
- Responsive Material-UI components
- Mobile hamburger navigation menu
- Drawer navigation for desktop
- Adaptive layouts

---

## Future Enhancement Opportunities

1. Real-time notifications for goal achievements
2. Social features (friend connections, group challenges)
3. AI-powered workout recommendations
4. Integration with fitness wearables
5. Advanced analytics and insights
6. Push notifications
7. Offline capability (PWA)
8. Mobile native apps (React Native)
9. Barcode scanner for food logging
10. Video tutorials for exercises

---

## Configuration Files

### Frontend
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - Linting rules
- `index.html` - HTML entry point

### Backend
- `config/settings.py` - Django settings
- `config/urls.py` - URL routing
- `manage.py` - Django management script

---

## Document Version
**Generated**: January 2026
**Application Version**: 0.0.0
**Status**: Active Development

---

## Summary

The Fitness Tracker is a full-featured fitness management application with:
- **10+ Core Features** for complete fitness tracking
- **Modern Tech Stack** using React 19, Django 5.1, and REST Framework
- **Comprehensive Database** with 8+ interconnected data models
- **Responsive UI** with Material-UI components
- **Secure Authentication** with JWT tokens
- **Real-time Analytics** with Chart.js visualization

The application provides a complete ecosystem for users to track their fitness journey from workouts and nutrition to goals and progress analytics.

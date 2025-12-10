import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  TextField, 
  Chip, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

// Mock data for exercises
const MOCK_EXERCISES = [
  {
    id: 1,
    name: "Bench Press",
    muscle: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-41c-bench-press-m1-16x9.jpg",
    instructions: [
      "Lie flat on bench with feet firmly planted on the ground",
      "Grip the barbell slightly wider than shoulder width",
      "Unrack the bar and hold it directly above your chest",
      "Lower the bar slowly to mid-chest level",
      "Press the bar back up to the starting position",
      "Keep your wrists straight and elbows tucked at about 45 degrees",
      "Maintain control throughout the entire movement"
    ]
  },
  {
    id: 2,
    name: "Dumbbell Flyes",
    muscle: "Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbells, Bench",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-47d-dumbbell-fly-m1-16x9.jpg",
    instructions: [
      "Lie flat on bench holding dumbbells above chest",
      "Begin with dumbbells together above chest, palms facing each other",
      "Keep slight bend in elbows throughout movement",
      "Lower weights in wide arc until chest is stretched",
      "Maintain same elbow angle during entire movement",
      "Squeeze chest muscles as you bring weights back up",
      "Control the movement throughout the full range"
    ]
  },
  {
    id: 3,
    name: "Lat Pulldown",
    muscle: "Back",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-55c-wide-grip-lat-pulldown-m1-16x9.jpg",
    instructions: [
      "Sit at machine with thighs secured under pad",
      "Grasp bar with wide grip, slightly wider than shoulders",
      "Start with arms fully extended and slight lean back",
      "Pull bar down to upper chest while squeezing lats",
      "Keep chest up and maintain good posture",
      "Control the bar as you return to starting position",
      "Maintain tension on lats throughout movement"
    ]
  },
  {
    id: 4,
    name: "Barbell Rows",
    muscle: "Back",
    difficulty: "Intermediate",
    equipment: "Barbell",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-06b-barbell-row-m1-16x9.jpg",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Bend at hips and knees, keeping back straight",
      "Grip barbell with hands slightly wider than shoulder width",
      "Keep core tight and chest up throughout movement",
      "Pull barbell to lower chest/upper abdomen",
      "Squeeze shoulder blades together at top of movement",
      "Lower weight with control to starting position"
    ]
  },
  {
    id: 5,
    name: "Squats",
    muscle: "Legs",
    difficulty: "Intermediate",
    equipment: "Barbell, Rack",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-44s-barbell-back-squat-m1-16x9.jpg",
    instructions: [
      "Position bar on upper back (not on neck)",
      "Stand with feet slightly wider than shoulder-width",
      "Point toes slightly outward",
      "Break at hips and knees simultaneously",
      "Keep chest up and core braced throughout",
      "Descend until thighs are parallel to ground",
      "Drive through heels to return to starting position"
    ]
  },
  {
    id: 6,
    name: "Romanian Deadlift",
    muscle: "Legs",
    difficulty: "Intermediate",
    equipment: "Barbell",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-40b-romanian-deadlift-m1-16x9.jpg",
    instructions: [
      "Stand with feet hip-width apart",
      "Hold barbell in front of thighs with overhand grip",
      "Keep back straight and chest up throughout",
      "Push hips back while lowering the bar",
      "Keep bar close to legs throughout movement",
      "Feel stretch in hamstrings at bottom position",
      "Drive hips forward to return to standing"
    ]
  },
  {
    id: 7,
    name: "Overhead Press",
    muscle: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Barbell",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-49b-standing-military-press-m1-16x9.jpg",
    instructions: [
      "Start with bar at shoulder level, grip just outside shoulders",
      "Keep core tight and glutes squeezed",
      "Press bar straight overhead",
      "Keep lower back neutral throughout",
      "Fully lock out arms at the top",
      "Lower bar with control back to shoulders",
      "Breathe out on press up, in on return"
    ]
  },
  {
    id: 8,
    name: "Lateral Raises",
    muscle: "Shoulders",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-42d-lateral-raise-m1-16x9.jpg",
    instructions: [
      "Stand holding dumbbells at sides",
      "Keep slight bend in elbows",
      "Raise arms out to sides until parallel with ground",
      "Lead with elbows, not hands",
      "Pause briefly at top of movement",
      "Lower slowly to starting position",
      "Avoid swinging or using momentum"
    ]
  },
  {
    id: 9,
    name: "Bicep Curls",
    muscle: "Arms",
    difficulty: "Beginner",
    equipment: "Dumbbells",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-44d-standing-dumbbell-curl-m1-16x9.jpg",
    instructions: [
      "Stand with dumbbells at sides, palms facing forward",
      "Keep upper arms stationary against sides",
      "Curl weights up toward shoulders",
      "Keep wrists straight throughout movement",
      "Squeeze biceps at top of movement",
      "Lower weights with control",
      "Avoid swinging or using momentum"
    ]
  },
  {
    id: 10,
    name: "Tricep Pushdowns",
    muscle: "Arms",
    difficulty: "Beginner",
    equipment: "Cable Machine",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-51c-triceps-pushdown-m1-16x9.jpg",
    instructions: [
      "Stand facing cable machine, feet shoulder-width apart",
      "Grip bar with hands shoulder-width apart",
      "Keep upper arms locked at sides",
      "Push bar down until arms are fully straight",
      "Squeeze triceps hard at bottom",
      "Control weight on return movement",
      "Keep core engaged throughout"
    ]
  },
  {
    id: 11,
    name: "Plank",
    muscle: "Core",
    difficulty: "Beginner",
    equipment: "None",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-131a-plank-m1-16x9.jpg",
    instructions: [
      "Start in forearm plank position",
      "Place forearms parallel to each other",
      "Keep body in straight line from head to heels",
      "Engage core and squeeze glutes",
      "Keep neck neutral, looking at floor",
      "Don't let hips sag or pike up",
      "Hold position for prescribed time"
    ]
  },
  {
    id: 12,
    name: "Russian Twists",
    muscle: "Core",
    difficulty: "Intermediate",
    equipment: "Weight (Optional)",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-59a-russian-twist-m1-16x9.jpg",
    instructions: [
      "Sit with knees bent, feet off ground",
      "Lean back slightly to engage core",
      "Hold weight or clasp hands at chest level",
      "Keep back straight throughout movement",
      "Twist torso from side to side",
      "Touch weight/hands to ground on each side",
      "Maintain elevated feet throughout"
    ]
  },
  {
    id: 13,
    name: "Burpees",
    muscle: "Full Body",
    difficulty: "Advanced",
    equipment: "None",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-128a-burpee-m1-16x9.jpg",
    instructions: [
      "Start in standing position",
      "Drop into squat position, placing hands on ground",
      "Kick feet back into plank position",
      "Perform one push-up",
      "Jump feet back to squat position",
      "Explosively jump up with arms overhead",
      "Land softly and immediately begin next rep"
    ]
  },
  {
    id: 14,
    name: "Kettlebell Swing",
    muscle: "Full Body",
    difficulty: "Intermediate",
    equipment: "Kettlebell",
    gifUrl: "https://www.bodybuilding.com/images/2020/xdb/originals/xdb-23k-kettlebell-swing-m1-16x9.jpg",
    instructions: [
      "Stand with feet slightly wider than shoulder width",
      "Hold kettlebell with both hands between legs",
      "Hinge at hips while keeping back straight",
      "Keep arms straight throughout movement",
      "Explosively drive hips forward",
      "Let momentum swing weight to shoulder height",
      "Control swing back between legs"
    ]
  }
];

// ...existing code...

const MUSCLE_GROUPS = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body"
];

function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Enhanced search filtering
  const filteredExercises = useMemo(() => {
    return MOCK_EXERCISES.filter(exercise => {
      const searchFields = [
        exercise.name.toLowerCase(),
        exercise.muscle.toLowerCase(),
        exercise.equipment.toLowerCase(),
        exercise.difficulty.toLowerCase()
      ];
      const searchTerms = searchTerm.toLowerCase().split(' ');
      
      const matchesSearch = searchTerms.every(term => 
        searchFields.some(field => field.includes(term))
      );
      const matchesMuscle = selectedMuscle === 'All' || exercise.muscle === selectedMuscle;
      
      return matchesMuscle && matchesSearch;
    });
  }, [searchTerm, selectedMuscle]);

  const handleOpen = (exercise) => {
    setSelectedExercise(exercise);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedExercise(null);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>Exercise Library</Typography>
      
      {/* Search and Filter Section */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField 
          label="Search Exercises"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search by name, muscle group, or equipment..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color={searchFocused ? 'primary' : 'action'} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.3s',
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
              },
            },
          }}
        />
        
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1 }}>
          {MUSCLE_GROUPS.map(muscle => (
            <Chip 
              key={muscle}
              label={muscle}
              clickable
              color={selectedMuscle === muscle ? 'primary' : 'default'}
              onClick={() => setSelectedMuscle(muscle)}
            />
          ))}
        </Stack>
      </Stack>

      {filteredExercises.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No exercises found matching your search criteria.
          </Typography>
        </Box>
      )}

      {/* Exercise Grid */}
      <Grid container spacing={3}>
        {filteredExercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <CardActionArea onClick={() => handleOpen(exercise)}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={exercise.gifUrl}
                  alt={exercise.name}
                  sx={{ 
                    objectFit: 'contain',
                    backgroundColor: 'grey.200',
                    minHeight: 200,
                  }}
                  onError={(e) => {
                    console.log(`Failed to load image for ${exercise.name}`);
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/400x300/eee?text=${encodeURIComponent(exercise.name)}`;
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {exercise.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exercise.muscle} • {exercise.difficulty}
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>

      {/* Exercise Detail Dialog */}
      {selectedExercise && (
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {selectedExercise.name}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    backgroundColor: 'grey.200',
                  }}
                  src={selectedExercise.gifUrl}
                  alt={selectedExercise.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Instructions
                </Typography>
                <List sx={{ listStyleType: 'decimal', pl: 2 }}>
                  {selectedExercise.instructions.map((step, index) => (
                    <ListItem key={index} sx={{ display: 'list-item', p: 0.5 }}>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Difficulty:</strong> {selectedExercise.difficulty}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Equipment:</strong> {selectedExercise.equipment}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default ExerciseLibrary;
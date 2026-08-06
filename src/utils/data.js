import { Dumbbell, Salad, Target, BarChart3, Calendar, Zap, TrendingUp } from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Exercises', href: '#exercises' },
  { label: 'Muscles', href: '#muscles' },
  { label: 'Workout Plans', href: '#workouts' },
  { label: 'Diet Plans', href: '#diet' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

export const FEATURES = [
  {
    icon: Dumbbell,
    title: 'Exercise Library',
    description: 'Browse 500+ exercises categorized by muscle group, equipment, and difficulty level.',
    color: '#7CFF5B',
  },
  {
    icon: Calendar,
    title: 'Workout Planner',
    description: 'Generate personalized workout plans based on your goals, experience, and available equipment.',
    color: '#5BE7FF',
  },
  {
    icon: Zap,
    title: 'Diet Planner',
    description: 'Personalized meal recommendations and nutrition tracking to fuel your fitness journey.',
    color: '#FF5B8A',
  },
  {
    icon: Target,
    title: 'Muscle Guide',
    description: 'Interactive 3D muscle anatomy guide to understand every muscle group and its function.',
    color: '#FFB85B',
  },
  {
    icon: BarChart3,
    title: 'Workout Tracker',
    description: 'Track sets, reps, weights, and progress session by session with detailed logging.',
    color: '#B75BFF',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Beautiful charts and statistics showing your strength gains, volume trends, and consistency.',
    color: '#5BFFC8',
  },
];

export const EXERCISES = [
  {
    name: 'Bench Press',
    muscle: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Squat',
    muscle: 'Quadriceps',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Deadlift',
    muscle: 'Back',
    difficulty: 'Advanced',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1571846210581-5e1c4a37cce1?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Lat Pulldown',
    muscle: 'Back',
    difficulty: 'Beginner',
    equipment: 'Cable',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c3?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Bicep Curl',
    muscle: 'Biceps',
    difficulty: 'Beginner',
    equipment: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2df3?w=600&h=400&fit=crop&q=80',
  },
  {
    name: 'Leg Press',
    muscle: 'Quadriceps',
    difficulty: 'Beginner',
    equipment: 'Machine',
    image: 'https://images.unsplash.com/photo-1603281803106-7558c8d33a83?w=600&h=400&fit=crop&q=80',
  },
];

export const MUSCLE_GROUPS = [
  { id: 'chest', label: 'Chest', position: { top: '14%', left: '48%' }, color: '#7CFF5B' },
  { id: 'shoulders', label: 'Shoulders', position: { top: '8%', left: '48%' }, color: '#5BE7FF' },
  { id: 'biceps', label: 'Biceps', position: { top: '22%', left: '18%' }, color: '#FF5B8A' },
  { id: 'triceps', label: 'Triceps', position: { top: '22%', left: '64%' }, color: '#FFB74B' },
  { id: 'forearms', label: 'Forearms', position: { top: '32%', left: '10%' }, color: '#B75BF5' },
  { id: 'back', label: 'Back', position: { top: '28%', left: '80%' }, color: '#FF5B5B' },
  { id: 'core', label: 'Core', position: { top: '36%', left: '48%' }, color: '#5B7CFF' },
  { id: 'quads', label: 'Quads', position: { top: '52%', left: '48%' }, color: '#FF5BC5' },
  { id: 'hamstrings', label: 'Hamstrings', position: { top: '62%', left: '72%' }, color: '#5BE7FF' },
  { id: 'calves', label: 'Calves', position: { top: '72%', left: '48%' }, color: '#7CFF5B' },
  { id: 'glutes', label: 'Glutes', position: { top: '42%', left: '75%' }, color: '#FFB74D' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Choose Your Goals',
    description: 'Select your fitness goals — build muscle, lose fat, improve endurance, or all of them. We personalize everything.',
    icon: Target,
  },
  {
    step: '02',
    title: 'Create Your Workout',
    description: 'Get auto-generated workout plans tailored to your goals, schedule, and available equipment.',
    icon: Dumbbell,
  },
  {
    step: '03',
    title: 'Track & Transform',
    description: 'Log your workouts, track progress with beautiful analytics, and watch yourself evolve into the best version of you.',
    icon: TrendingUp,
  },
];

export const TESTIMONIALS = [
  {
    name: 'Alex Martinez',
    role: 'Lost 45 lbs in 6 months',
    content: 'FitPulse completely changed my approach to fitness. The workout tracking is incredible and the progress analytics keep me motivated every single day.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
  },
  {
    name: 'Jessica Lee',
    role: 'Competitive Powerlifter',
    content: 'The exercise library is the most comprehensive I\'ve seen. As a competitive lifter, the detailed analytics help me optimize performance in ways I never could before.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
  },
  {
    name: 'Marcus Chen',
    role: 'Personal Trainer',
    content: 'I recommend FitPulse to all my clients. The progress tracking and diet planning features are world-class. It\'s like having a personal assistant for fitness.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
  },
  {
    name: 'Priya Sharma',
    role: 'Yoga Instructor',
    content: 'The clean design makes planning workouts something I actually look forward to rather than dreading. The UI is gorgeous and intuitive.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528971740-50bd3cfa1e63?w=100&h=100&fit=crop&q=80',
  },
];

export const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Changelog', 'Integrations', 'API'],
  Resources: ['Blog', 'Guides', 'Exercise Database', 'Diet Plans', 'Workout Plans'],
  Company: ['About', 'Careers', 'Contact', 'Press', 'Partners'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR', 'Security'],
};

export const DIFFICULTY_COLORS = {
  Beginner: '#7CFF5B',
  Intermediate: '#FFB75B',
  Advanced: '#FF5B8A',
};
import { Bookmark, BookOpen, Bot, Brain, FileText, Target, TrendingUp, Trophy, Users } from 'lucide-react';

export const stats = [
    { number: '50,000+', label: 'Active Users', icon: Users },
    { number: '100,000+', label: 'MCQs Available', icon: FileText },
    { number: '95%', label: 'Success Rate', icon: Trophy },
    { number: '24/7', label: 'AI Support', icon: Bot },
];

export const features = [
    {
        icon: Brain,
        title: 'AI-Enhanced MCQs',
        description: 'Intelligent question rephrasing and explanation generation',
        count: '5,000+',
    },
    {
        icon: Target,
        title: 'Mock Tests',
        description: 'Realistic exam simulations with detailed analytics',
        count: '500+',
    },
    {
        icon: Bookmark,
        title: 'Custom Tests',
        description: 'Create personalized test sets based on your needs',
        count: 'Unlimited',
    },
    {
        icon: BookOpen,
        title: 'Subject-Based',
        description: 'Comprehensive coverage across multiple subjects',
        count: '50+',
    },
    {
        icon: Users,
        title: 'Job-Specific',
        description: 'Targeted preparation for career paths',
        count: '100+',
    },
    {
        icon: TrendingUp,
        title: 'Most Repeating',
        description: 'AI-identified frequently asked questions',
        count: 'Top 10K',
    },
];

export const mostRepeatingMCQs = [
    { question: 'What is the speed of light in vacuum?', attempts: 45000, subject: 'Physics' },
    { question: 'Who wrote Romeo and Juliet?', attempts: 38000, subject: 'English' },
    { question: 'What is the chemical formula for water?', attempts: 42000, subject: 'Chemistry' },
    { question: 'What is 2 + 2?', attempts: 67000, subject: 'Mathematics' },
    { question: 'What is the largest planet in our solar system?', attempts: 35000, subject: 'Geography' },
];

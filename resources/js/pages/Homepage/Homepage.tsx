import { SelectBySearch } from '@/components/combobox';
import McqCard from '@/components/mcqComponents/SingleMcq';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';
import { Bookmark, BookOpen, Bot, Brain, FileText, Filter, Search, Target, TrendingUp, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeroSection from './Components/HeroSection';

interface Props {
    mcqMode: boolean;
}

const MCQHomepage = ({ mcqMode }: Props) => {
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [selectedJobType, setSelectedJobType] = useState('All Jobs');
    const [selectedTestService, setSelectedTestService] = useState('All Services');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentMCQ, setCurrentMCQ] = useState(0);

    const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'History', 'Geography'];
    const jobTypes = ['All Jobs', 'Software Engineer', 'Data Scientist', 'Civil Service', 'Banking', 'Teaching', 'Medical', 'Engineering'];
    const testServices = ['All Services', 'UPSC', 'SSC', 'GATE', 'NET', 'JEE', 'NEET', 'CAT', 'GRE'];

    const sampleMCQs = [
        {
            id: 1,
            question: 'What is the time complexity of binary search algorithm?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 1,
            subject: 'Computer Science',
            difficulty: 'Medium',
            views: 1250,
            successRate: 78,
            aiEnhanced: true,
            tags: ['Algorithm', 'Binary Search', 'Complexity'],
            testService: 'GATE',
            explanation:
                'Paris is the capital and most populous city of France. It has been the capital since the 6th century and is located in the north-central part of the country along the Seine River.',
        },
        {
            id: 2,
            question: 'Which of the following is the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
            correctAnswer: 1,
            subject: 'Biology',
            difficulty: 'Easy',
            views: 2150,

            successRate: 92,
            aiEnhanced: true,
            tags: ['Cell Biology', 'Organelles'],
            testService: 'NEET',
        },
        {
            id: 3,
            question: 'What is the derivative of sin(x) with respect to x?',
            options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
            correctAnswer: 0,
            subject: 'Mathematics',
            difficulty: 'Easy',
            views: 1890,

            successRate: 85,
            aiEnhanced: false,
            tags: ['Calculus', 'Derivatives', 'Trigonometry'],
            testService: 'JEE',
        },
        {
            id: 4,
            question: "Which gas is most abundant in Earth's atmosphere?",
            options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
            correctAnswer: 2,
            subject: 'Chemistry',
            difficulty: 'Easy',
            views: 1670,

            successRate: 88,
            aiEnhanced: true,
            tags: ['Atmosphere', 'Gases'],
            testService: 'UPSC',
        },
        {
            id: 5,
            question: 'What is the capital of Australia?',
            options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
            correctAnswer: 2,
            subject: 'Geography',
            difficulty: 'Medium',
            views: 980,

            successRate: 65,
            aiEnhanced: false,
            tags: ['World Geography', 'Capitals'],
            testService: 'SSC',
        },
        {
            id: 6,
            question: 'In Object-Oriented Programming, what does inheritance mean?',
            options: ['Creating new objects', 'Acquiring properties from parent class', 'Hiding data', 'Polymorphism'],
            correctAnswer: 1,
            subject: 'Computer Science',
            difficulty: 'Medium',
            views: 1456,
            successRate: 74,
            aiEnhanced: true,
            tags: ['OOP', 'Inheritance', 'Programming'],
            testService: 'GATE',
        },
    ];

    const stats = [
        { number: '50,000+', label: 'Active Users', icon: Users },
        { number: '100,000+', label: 'MCQs Available', icon: FileText },
        { number: '95%', label: 'Success Rate', icon: Trophy },
        { number: '24/7', label: 'AI Support', icon: Bot },
    ];

    const features = [
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

    const mostRepeatingMCQs = [
        { question: 'What is the speed of light in vacuum?', attempts: 45000, subject: 'Physics' },
        { question: 'Who wrote Romeo and Juliet?', attempts: 38000, subject: 'English' },
        { question: 'What is the chemical formula for water?', attempts: 42000, subject: 'Chemistry' },
        { question: 'What is 2 + 2?', attempts: 67000, subject: 'Mathematics' },
        { question: 'What is the largest planet in our solar system?', attempts: 35000, subject: 'Geography' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMCQ((prev) => (prev + 1) % sampleMCQs.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sampleMCQs.length]);

    const filteredMCQs = sampleMCQs.filter((mcq) => {
        const matchesSubject = selectedSubject === 'All Subjects' || mcq.subject === selectedSubject;
        const matchesJob =
            selectedJobType === 'All Jobs' || mcq.tags.some((tag) => tag.toLowerCase().includes(selectedJobType.toLowerCase().split(' ')[0]));
        const matchesService = selectedTestService === 'All Services' || mcq.testService === selectedTestService;
        const matchesSearch =
            searchQuery === '' ||
            mcq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mcq.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesSubject && matchesJob && matchesService && matchesSearch;
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section with MCQ Preview */}
            <HeroSection stats={stats} currentMCQ={currentMCQ} sampleMCQs={sampleMCQs} />
            {/* Search and Filter Section */}
            <section className="border-y px-4 py-6 sm:px-6 md:py-12 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="mb-2 text-xl font-bold md:text-3xl">Explore MCQs</h2>
                            <p className="text-sm text-muted-foreground md:text-xl">Find the perfect questions for your preparation</p>
                        </div>

                        <div className="flex w-full flex-row items-center space-x-4 md:max-w-sm">
                            <div className="relative w-full flex-1">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                                <Input
                                    type="text"
                                    placeholder="Search MCQs, topics, or keywords..."
                                    className="w-full rounded-lg bg-input py-5 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} size="icon">
                                <Filter className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mb-8 rounded-lg bg-accent p-6 shadow">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Subject</label>
                                    <SelectBySearch
                                        data={subjects}
                                        placeholder="Select Subject"
                                        onChange={(selected) => {
                                            const value = selected?.label;
                                            if (value) setSelectedSubject(value);
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Job Type</label>
                                    <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value)}>
                                        <SelectTrigger className="bg-input font-semibold transition-all focus:ring focus:ring-primary focus:outline-0">
                                            <SelectValue className="px-3 py-2" placeholder="Select Testing Service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject} value={subject}>
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Testing Service</label>
                                    <Select value={selectedTestService} onValueChange={(value) => setSelectedTestService(value)}>
                                        <SelectTrigger>
                                            <SelectValue
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                                placeholder="Select Testing Service"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {testServices.map((service) => (
                                                <SelectItem key={service} value={service}>
                                                    {service}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MCQ Results */}
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                        <div className="lg:col-span-2">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-xl font-semibold">MCQs ({filteredMCQs.length} found)</h3>
                                <div className="flex items-center space-x-2">
                                    <Select>
                                        <SelectTrigger className="bg-white dark:border-gray-400 dark:bg-gray-700">
                                            <SelectValue placeholder="Sort By" />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            <SelectItem value="most_popular">Most Popular</SelectItem>
                                            <SelectItem value="newest">Newest</SelectItem>
                                            <SelectItem value="difficulty">Difficulty</SelectItem>
                                            <SelectItem value="success_rate">Success Rate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-6">
                                {/* Mode instruction */}
                                {!mcqMode && (
                                    <p className="mb-3 rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                                        📖 Study Mode: The correct answer is highlighted in green
                                    </p>
                                )}
                                {filteredMCQs.map((mcq, index) => (
                                    <McqCard mcq={mcq} index={index} mcqMode={mcqMode} />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Features Overview */}
                            <div className="rounded-lg bg-card p-6 shadow-md dark:bg-card">
                                <h3 className="mb-4 text-lg font-semibold">Platform Features</h3>
                                <div className="space-y-4">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-black">
                                                <feature.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-300">{feature.count}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Most Repeating MCQs */}
                            <div className="rounded-lg bg-card p-4 shadow-md md:p-6">
                                <h3 className="mb-2 flex items-center text-lg font-semibold md:mb-4">
                                    <TrendingUp className="mr-2 h-5 w-5" />
                                    Most Repeating MCQs
                                </h3>
                                <div className="space-y-3">
                                    {mostRepeatingMCQs.map((mcq, index) => (
                                        <div key={index} className="mb:pb-3 overflow-hidden border-b border-gray-100 pb-2 last:border-b-0">
                                            <Link href="#" className="text-sm font-semibold whitespace-normal hover:underline">
                                                {mcq.question}
                                            </Link>
                                            <div className="mt-1 flex items-center justify-between">
                                                <span className="max-w-40 truncate text-xs text-gray-500 dark:text-gray-300">{mcq.subject}</span>
                                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                                    {mcq.attempts.toLocaleString()} attempts
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="mt-2 w-full md:mt-4">
                                    View All Trending
                                </Button>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {stats.slice(2).map((stat, index) => (
                                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                                        <div className="mb-2 flex items-center justify-center">
                                            <stat.icon className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div className="text-lg font-bold text-black">{stat.number}</div>
                                        <div className="text-xs text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Call to Action */}
            <section className="bg-accent px-4 py-16 text-accent-foreground sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-4xl font-bold">Ready to Excel in Your Exams?</h2>
                    <p className="mb-8 text-xl">Join thousands of students who have improved their scores with our AI-powered MCQ platform</p>
                    <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                        <Button
                            variant="default"
                            size="lg"
                            className="rounded-2xl px-12 py-8 text-lg font-semibold transition-all"
                            // className="rounded-lg bg-white px-8 !py-4 text-lg font-semibold text-black transition-all hover:bg-gray-100"
                        >
                            Start Free Trial
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl px-12 py-8 text-lg font-semibold transition-all">
                            View Demo
                        </Button>
                        {/* <button className="rounded-lg border border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-black">
                            View Pricing
                        </button> */}
                    </div>
                </div>
            </section>
            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                                    <Brain className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-black">MCQ Master</span>
                            </div>
                            <p className="text-sm text-gray-600">AI-powered MCQ platform for comprehensive exam preparation.</p>
                        </div>

                        <div>
                            <h3 className="mb-3 font-semibold text-black">Features</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>AI-Enhanced MCQs</li>
                                <li>Mock Tests</li>
                                <li>Custom Tests</li>
                                <li>Subject-Based Practice</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-3 font-semibold text-black">Subjects</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Computer Science</li>
                                <li>Mathematics</li>
                                <li>Biology</li>
                                <li>Physics & Chemistry</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-3 font-semibold text-black">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Help Center</li>
                                <li>Contact Us</li>
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
                        <p>&copy; 2024 MCQ Master. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MCQHomepage;

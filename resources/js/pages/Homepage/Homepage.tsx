import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bookmark, BookOpen, Bot, Brain, ChevronDown, Eye, FileText, Filter, Play, Search, Target, TrendingUp, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeroMcqPreview from './Components/HeroMcqCard';

const MCQHomepage = () => {
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
            attempts: 890,
            successRate: 78,
            aiEnhanced: true,
            tags: ['Algorithm', 'Binary Search', 'Complexity'],
            testService: 'GATE',
        },
        {
            id: 2,
            question: 'Which of the following is the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
            correctAnswer: 1,
            subject: 'Biology',
            difficulty: 'Easy',
            views: 2150,
            attempts: 1560,
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
            attempts: 1234,
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
            attempts: 1123,
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
            attempts: 678,
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
            attempts: 967,
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
        <div className="min-h-screen bg-white text-black">
            {/* Navigation */}
            {/* <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
                                <Brain className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-black">Pak Quiz</span>
                                <span className="text-xs text-gray-600">AI-Powered Learning</span>
                            </div>
                        </div>
                        <div className="hidden space-x-8 md:flex">
                            <a href="#mcqs" className="font-medium text-gray-700 transition-colors hover:text-black">
                                MCQs
                            </a>
                            <a href="#tests" className="font-medium text-gray-700 transition-colors hover:text-black">
                                Tests
                            </a>
                            <a href="#subjects" className="font-medium text-gray-700 transition-colors hover:text-black">
                                Subjects
                            </a>
                            <a href="#analytics" className="font-medium text-gray-700 transition-colors hover:text-black">
                                Analytics
                            </a>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 font-medium text-gray-700 transition-colors hover:text-black">Login</button>
                            <button className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-all hover:bg-gray-800">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav> */}

            {/* Hero Section with MCQ Preview */}
            <section className="bg-gray-50 px-4 pt-24 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-black px-4 py-2 text-white">
                                <Bot className="h-4 w-4" />
                                <span className="text-sm font-medium">AI-Enhanced Learning</span>
                            </div>

                            <h1 className="mb-6 text-5xl leading-tight font-bold text-black lg:text-6xl">
                                Master MCQs with
                                <span className="block text-gray-600">Intelligent Practice</span>
                            </h1>

                            <p className="mb-8 text-xl leading-relaxed text-gray-600">
                                Access thousands of AI-enhanced multiple choice questions across subjects, jobs, and testing services. Practice
                                smarter, not harder.
                            </p>

                            <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                <button className="flex items-center justify-center space-x-2 rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-gray-800">
                                    <Play className="h-5 w-5" />
                                    <span>Start Practicing</span>
                                </button>
                                <button className="flex items-center justify-center space-x-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:border-gray-400">
                                    <Eye className="h-5 w-5" />
                                    <span>View Demo</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {stats.slice(0, 2).map((stat, index) => (
                                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 text-center">
                                        <div className="mb-2 flex items-center justify-center">
                                            <stat.icon className="h-8 w-8 text-gray-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-black">{stat.number}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <HeroMcqPreview currentMCQ={currentMCQ} sampleMCQs={sampleMCQs} />
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-black">Explore MCQs</h2>
                            <p className="text-gray-600">Find the perfect questions for your preparation</p>
                        </div>

                        <div className="flex flex-col items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search MCQs, topics, or keywords..."
                                    className="w-80 rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:bg-gray-50"
                            >
                                <Filter className="h-5 w-5" />
                                <span>Filters</span>
                                <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="mb-8 rounded-lg bg-gray-50 p-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Subject</label>
                                    <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value)}>
                                        <SelectTrigger>
                                            <SelectValue
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                                placeholder="Select Testing Service"
                                            />
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
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Job Type</label>
                                    <Select value={selectedJobType} onValueChange={(value) => setSelectedJobType(value)}>
                                        <SelectTrigger>
                                            <SelectValue
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                                placeholder="Select Testing Service"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jobTypes.map((job) => (
                                                <SelectItem key={job} value={job}>
                                                    {job}
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
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-black">MCQs ({filteredMCQs.length} found)</h3>
                                <div className="flex items-center space-x-2">
                                    <Select>
                                        <SelectTrigger className="rounded border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none">
                                            <SelectValue placeholder="Sort By" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="most_popular">Most Popular</SelectItem>
                                                <SelectItem value="newest">Newest</SelectItem>
                                                <SelectItem value="difficulty">Difficulty</SelectItem>
                                                <SelectItem value="success_rate">Success Rate</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {filteredMCQs.map((mcq, index) => (
                                    <div key={mcq.id} className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">{mcq.subject}</span>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        mcq.difficulty === 'Easy'
                                                            ? 'bg-green-100 text-green-700'
                                                            : mcq.difficulty === 'Medium'
                                                              ? 'bg-yellow-100 text-yellow-700'
                                                              : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {mcq.difficulty}
                                                </span>
                                                {mcq.aiEnhanced && (
                                                    <span className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                        <Bot className="h-3 w-3" />
                                                        <span>AI</span>
                                                    </span>
                                                )}
                                            </div>
                                            <Button className="text-gray-100 hover:text-gray-600">
                                                <Bookmark className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <h4 className="mb-4 text-lg font-semibold text-black">
                                            Q{index + 1}. {mcq.question}
                                        </h4>

                                        <div className="mb-4 grid gap-3 sm:grid-cols-2">
                                            {mcq.options.map((option, optIndex) => (
                                                <div key={optIndex} className="flex items-center space-x-3 rounded bg-gray-50 p-3 text-sm">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                                                        <span className="text-xs font-medium text-gray-600">
                                                            {String.fromCharCode(65 + optIndex)}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-700">{option}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>
                                                    <Eye className="mr-1 inline h-4 w-4" />
                                                    {mcq.views}
                                                </span>
                                                <span>
                                                    <Target className="mr-1 inline h-4 w-4" />
                                                    {mcq.attempts}
                                                </span>
                                                <span className="text-green-600">{mcq.successRate}% Success</span>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200">
                                                    Practice
                                                </button>
                                                <button className="rounded bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800">
                                                    Add to Test
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Features Overview */}
                            <div className="rounded-lg bg-gray-50 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-black">Platform Features</h3>
                                <div className="space-y-4">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-black">
                                                <feature.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-black">{feature.title}</h4>
                                                <p className="text-xs text-gray-600">{feature.count}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Most Repeating MCQs */}
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <h3 className="mb-4 flex items-center text-lg font-semibold text-black">
                                    <TrendingUp className="mr-2 h-5 w-5" />
                                    Most Repeating MCQs
                                </h3>
                                <div className="space-y-3">
                                    {mostRepeatingMCQs.map((mcq, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                            <p className="truncate text-sm font-medium text-black">{mcq.question}</p>
                                            <div className="mt-1 flex items-center justify-between">
                                                <span className="text-xs text-gray-500">{mcq.subject}</span>
                                                <span className="text-xs text-gray-600">{mcq.attempts.toLocaleString()} attempts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 w-full rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200">
                                    View All Trending
                                </button>
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
            <section className="bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-4xl font-bold">Ready to Excel in Your Exams?</h2>
                    <p className="mb-8 text-xl text-gray-300">
                        Join thousands of students who have improved their scores with our AI-powered MCQ platform
                    </p>
                    <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                        <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-gray-100">
                            Start Free Trial
                        </button>
                        <button className="rounded-lg border border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-black">
                            View Pricing
                        </button>
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

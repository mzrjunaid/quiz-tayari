import { SelectBySearch } from '@/components/combobox';
import McqCard from '@/components/mcqComponents/SingleMcq';
import PageSidebar from '@/components/page-sidebar';
import { SitePagination } from '@/components/site-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { stats } from '@/constants/features';
import { LinkPaginatedData, Mcqs, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import HeroSection from './Components/HeroSection';

interface Props {
    mcqs: LinkPaginatedData<Mcqs>;
}

const MCQHomepage = ({ mcqs }: Props) => {
    const { mcqMode } = usePage<SharedData>().props;
    const { meta, links } = mcqs;
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMCQ((prev) => (prev + 1) % sampleMCQs.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sampleMCQs.length]);

    const filteredMCQs = mcqs.data.filter((mcq) => {
        const matchesSubject = selectedSubject === 'All Subjects' || mcq.subject === selectedSubject;
        const matchesJob =
            selectedJobType === 'All Jobs' || mcq.tags.some((tag) => tag.toLowerCase().includes(selectedJobType.toLowerCase().split(' ')[0]));
        const matchesService = selectedTestService === 'All Services' || mcq.paper?.testing_service.short === selectedTestService;
        const matchesSearch =
            searchQuery === '' ||
            mcq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mcq.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            mcq.paper?.department.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSubject && matchesJob && matchesService && matchesSearch;
    });

    const scrollRef = useRef<HTMLDivElement | null>(null);

    return (
        <>
            {/* <pre>{JSON.stringify(mcqs, null, 2)}</pre> */}
            {/* Hero Section with MCQ Preview */}
            <HeroSection stats={stats} currentMCQ={currentMCQ} sampleMCQs={sampleMCQs} />
            {/* Search and Filter Section */}
            <section className="border-y px-4 py-6 sm:px-6 md:py-16 lg:px-8" ref={scrollRef}>
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
                                        buttonStyle="w-full"
                                        contentStyle="md:w-[390px]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Job Type</label>
                                    <SelectBySearch
                                        data={jobTypes}
                                        placeholder="Select Job Types"
                                        onChange={(selected) => {
                                            const value = selected?.label;
                                            if (value) setSelectedJobType(value);
                                        }}
                                        buttonStyle="w-full"
                                        contentStyle="md:w-[390px]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Testing Service</label>
                                    <SelectBySearch
                                        data={testServices}
                                        placeholder="Select Job Types"
                                        onChange={(selected) => {
                                            const value = selected?.label;
                                            if (value) setSelectedTestService(value);
                                        }}
                                        buttonStyle="w-full"
                                        contentStyle="md:w-[390px]"
                                    />
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
                                        <Button variant="outline" asChild>
                                            <SelectTrigger className="border border-primary/20 dark:border-primary/40">
                                                <SelectValue placeholder="Sort By" />
                                            </SelectTrigger>
                                        </Button>
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
                                    <McqCard mcq={mcq} index={index} key={index} />
                                ))}

                                <SitePagination meta={meta} links={links} scrollRef={scrollRef} />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <PageSidebar />
                    </div>
                </div>
            </section>
        </>
    );
};

export default MCQHomepage;

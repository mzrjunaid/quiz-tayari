import PageTitle from '@/components/public-page-title';
import { MainSectionWithoutSidebarLayout } from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle, BookOpen, CheckCircle2, Clock, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Types
interface MCQ {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    category: string;
    explanation: string;
}

interface SelectedAnswers {
    [key: number]: number;
}

interface ShowExplanation {
    [key: number]: boolean;
}

// Sample MCQs data following PPSC pattern
const sampleMCQs: MCQ[] = [
    {
        id: 1,
        question: "Who is known as the 'Father of the Nation' in Pakistan?",
        options: ['Allama Iqbal', 'Quaid-e-Azam Muhammad Ali Jinnah', 'Liaquat Ali Khan', 'Sir Syed Ahmad Khan'],
        correctAnswer: 1,
        category: 'Pakistan Studies',
        explanation: 'Quaid-e-Azam Muhammad Ali Jinnah is recognized as the founder and Father of the Nation of Pakistan.',
    },
    {
        id: 2,
        question: 'What is the capital of Pakistan?',
        options: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'],
        correctAnswer: 2,
        category: 'General Knowledge',
        explanation: 'Islamabad became the capital of Pakistan in 1967, replacing Karachi.',
    },
    {
        id: 3,
        question: 'The longest river of Pakistan is:',
        options: ['River Chenab', 'River Jhelum', 'River Indus', 'River Ravi'],
        correctAnswer: 2,
        category: 'Pakistan Studies',
        explanation: 'River Indus is the longest river in Pakistan, flowing approximately 3,180 km.',
    },
    {
        id: 4,
        question: 'Choose the correct spelling:',
        options: ['Occassion', 'Occasion', 'Ocassion', 'Ocasion'],
        correctAnswer: 1,
        category: 'English',
        explanation: "The correct spelling is 'Occasion' with two 'c's and one 's'.",
    },
    {
        id: 5,
        question: 'If 5x + 3 = 18, what is the value of x?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1,
        category: 'Mathematics',
        explanation: '5x + 3 = 18 → 5x = 15 → x = 3',
    },
    {
        id: 6,
        question: 'The Holy Prophet (PBUH) was born in which year?',
        options: ['570 AD', '571 AD', '572 AD', '573 AD'],
        correctAnswer: 0,
        category: 'Islamiat',
        explanation: 'Prophet Muhammad (PBUH) was born in 570 AD in Makkah.',
    },
    {
        id: 7,
        question: 'How many Surah are there in the Holy Quran?',
        options: ['112', '113', '114', '115'],
        correctAnswer: 2,
        category: 'Islamiat',
        explanation: 'The Holy Quran contains 114 Surahs.',
    },
    {
        id: 8,
        question: 'Pakistan came into being on:',
        options: ['14th August 1947', '15th August 1947', '23rd March 1947', '25th December 1947'],
        correctAnswer: 0,
        category: 'Pakistan Studies',
        explanation: 'Pakistan gained independence on 14th August 1947.',
    },
    {
        id: 9,
        question: "The synonym of 'Abandon' is:",
        options: ['Keep', 'Maintain', 'Forsake', 'Continue'],
        correctAnswer: 2,
        category: 'English',
        explanation: 'Forsake means to abandon or leave behind, making it a synonym of abandon.',
    },
    {
        id: 10,
        question: '30% of 500 is:',
        options: ['100', '150', '200', '250'],
        correctAnswer: 1,
        category: 'Mathematics',
        explanation: '30% of 500 = (30/100) × 500 = 150',
    },
];

const PPSCPaperDemo: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [showResults, setShowResults] = useState<boolean>(false);
    const [timeRemaining, setTimeRemaining] = useState<number>(1800); // 30 minutes
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [showExplanation, setShowExplanation] = useState<ShowExplanation>({});

    // Timer logic
    useEffect(() => {
        if (timeRemaining > 0 && !showResults && !isPaused) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeRemaining === 0) {
            handleSubmit();
        }
    }, [timeRemaining, showResults, isPaused]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId: number, optionIndex: number): void => {
        if (!showResults) {
            setSelectedAnswers((prev) => ({
                ...prev,
                [questionId]: optionIndex,
            }));
        }
    };

    const handleSubmit = (): void => {
        setShowResults(true);
        setIsPaused(true);
    };

    const calculateScore = (): number => {
        let correct = 0;
        sampleMCQs.forEach((mcq) => {
            if (selectedAnswers[mcq.id] === mcq.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    const toggleExplanation = (questionId: number): void => {
        setShowExplanation((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const score: number = calculateScore();
    const totalQuestions: number = sampleMCQs.length;
    const percentage: string = ((score / totalQuestions) * 100).toFixed(1);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Homepage', href: route('home') },
        { title: 'PPSC Demo', href: route('demo') },
    ];

    return (
        <>
            <Head title="PPSCDemo"></Head>
            <PublicLayout>
                {/* Header */}
                <MainSectionWithoutSidebarLayout>
                    <div className="flex items-center justify-between">
                        <PageTitle title="PPSC Practice Paper" breadcrumbs={breadcrumbs} subtitle="General Knowledge & Aptitude Test - Demo" />
                        <div className="flex items-center gap-4 order-2">
                            <div
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                                    timeRemaining < 300 ? 'bg-red-50 text-red-700' : 'bg-white text-blue-700'
                                }`}
                            >
                                <Clock className="h-5 w-5" />
                                <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-6 border-t border-accent/50 mt-4">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                {!showResults ? (
                                    <div className="rounded-lg bg-white p-6 shadow-md">
                                        {/* Question Navigation */}
                                        <div className="mb-6 border-b pb-4">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>
                                                        Question {currentQuestion + 1} of {totalQuestions}
                                                    </span>
                                                </div>
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                                    {sampleMCQs[currentQuestion].category}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                                    style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Question */}
                                        <div className="mb-6">
                                            <h2 className="mb-6 text-lg leading-relaxed font-semibold text-gray-900">
                                                {currentQuestion + 1}. {sampleMCQs[currentQuestion].question}
                                            </h2>

                                            {/* Options */}
                                            <div className="space-y-3">
                                                {sampleMCQs[currentQuestion].options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAnswerSelect(sampleMCQs[currentQuestion].id, idx)}
                                                        className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                                                            selectedAnswers[sampleMCQs[currentQuestion].id] === idx
                                                                ? 'border-blue-600 bg-blue-50 shadow-sm'
                                                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                                                                    selectedAnswers[sampleMCQs[currentQuestion].id] === idx
                                                                        ? 'border-blue-600 bg-blue-600'
                                                                        : 'border-gray-300'
                                                                }`}
                                                            >
                                                                {selectedAnswers[sampleMCQs[currentQuestion].id] === idx && (
                                                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                                                )}
                                                            </div>
                                                            <span className="text-gray-800">{option}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-between border-t pt-6">
                                            <button
                                                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                                                disabled={currentQuestion === 0}
                                                className="rounded-lg border-2 border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Previous
                                            </button>

                                            {currentQuestion === totalQuestions - 1 ? (
                                                <button
                                                    onClick={handleSubmit}
                                                    className="rounded-lg bg-green-600 px-8 py-2 font-medium text-white shadow-sm hover:bg-green-700"
                                                >
                                                    Submit Paper
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setCurrentQuestion((prev) => Math.min(totalQuestions - 1, prev + 1))}
                                                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
                                                >
                                                    Next
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Results View */
                                    <div className="space-y-6">
                                        {/* Score Card */}
                                        <div className="rounded-lg bg-white p-6 shadow-md">
                                            <h2 className="mb-4 text-2xl font-bold text-gray-900">Test Results</h2>
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                <div className="rounded-lg bg-blue-50 p-4 text-center">
                                                    <p className="mb-1 text-sm text-gray-600">Total Questions</p>
                                                    <p className="text-2xl font-bold text-blue-700">{totalQuestions}</p>
                                                </div>
                                                <div className="rounded-lg bg-green-50 p-4 text-center">
                                                    <p className="mb-1 text-sm text-gray-600">Correct</p>
                                                    <p className="text-2xl font-bold text-green-700">{score}</p>
                                                </div>
                                                <div className="rounded-lg bg-red-50 p-4 text-center">
                                                    <p className="mb-1 text-sm text-gray-600">Incorrect</p>
                                                    <p className="text-2xl font-bold text-red-700">{totalQuestions - score}</p>
                                                </div>
                                                <div className="rounded-lg bg-purple-50 p-4 text-center">
                                                    <p className="mb-1 text-sm text-gray-600">Percentage</p>
                                                    <p className="text-2xl font-bold text-purple-700">{percentage}%</p>
                                                </div>
                                            </div>

                                            <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                                <p className="text-center text-lg font-semibold text-gray-900">
                                                    {Number(percentage) >= 70
                                                        ? '🎉 Excellent Performance!'
                                                        : Number(percentage) >= 50
                                                          ? '👍 Good Attempt!'
                                                          : '💪 Keep Practicing!'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Detailed Answers */}
                                        <div className="rounded-lg bg-white p-6 shadow-md">
                                            <h3 className="mb-4 text-xl font-bold text-gray-900">Detailed Review</h3>
                                            <div className="space-y-4">
                                                {sampleMCQs.map((mcq, idx) => {
                                                    const isCorrect: boolean = selectedAnswers[mcq.id] === mcq.correctAnswer;
                                                    const wasAnswered: boolean = selectedAnswers[mcq.id] !== undefined;

                                                    return (
                                                        <div
                                                            key={mcq.id}
                                                            className={`rounded-lg border-2 p-4 ${
                                                                isCorrect
                                                                    ? 'border-green-200 bg-green-50'
                                                                    : wasAnswered
                                                                      ? 'border-red-200 bg-red-50'
                                                                      : 'border-gray-200 bg-gray-50'
                                                            }`}
                                                        >
                                                            <div className="mb-3 flex items-start gap-3">
                                                                {isCorrect ? (
                                                                    <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                                                                ) : wasAnswered ? (
                                                                    <XCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                                                                ) : (
                                                                    <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-gray-400" />
                                                                )}
                                                                <div className="flex-1">
                                                                    <p className="mb-2 font-medium text-gray-900">
                                                                        {idx + 1}. {mcq.question}
                                                                    </p>
                                                                    <div className="space-y-2 text-sm">
                                                                        <p>
                                                                            <span className="font-semibold text-green-700">Correct Answer: </span>
                                                                            <span className="text-gray-900">{mcq.options[mcq.correctAnswer]}</span>
                                                                        </p>
                                                                        {wasAnswered && !isCorrect && (
                                                                            <p>
                                                                                <span className="font-semibold text-red-700">Your Answer: </span>
                                                                                <span className="text-gray-900">
                                                                                    {mcq.options[selectedAnswers[mcq.id]]}
                                                                                </span>
                                                                            </p>
                                                                        )}
                                                                        {!wasAnswered && <p className="text-gray-600 italic">Not attempted</p>}
                                                                    </div>

                                                                    <button
                                                                        onClick={() => toggleExplanation(mcq.id)}
                                                                        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        {showExplanation[mcq.id] ? '− Hide' : '+ Show'} Explanation
                                                                    </button>

                                                                    {showExplanation[mcq.id] && (
                                                                        <div className="mt-3 rounded border border-blue-200 bg-white p-3">
                                                                            <p className="text-sm text-gray-700">{mcq.explanation}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 rounded-lg bg-white p-4 shadow-md">
                                    <h3 className="mb-4 font-bold text-gray-900">Question Palette</h3>
                                    <div className="grid grid-cols-5 gap-2">
                                        {sampleMCQs.map((mcq, idx) => (
                                            <button
                                                key={mcq.id}
                                                onClick={() => !showResults && setCurrentQuestion(idx)}
                                                className={`h-10 w-10 rounded-lg border-2 text-sm font-medium transition-all ${
                                                    showResults
                                                        ? selectedAnswers[mcq.id] === mcq.correctAnswer
                                                            ? 'border-green-600 bg-green-500 text-white'
                                                            : selectedAnswers[mcq.id] !== undefined
                                                              ? 'border-red-600 bg-red-500 text-white'
                                                              : 'border-gray-300 bg-gray-200 text-gray-600'
                                                        : currentQuestion === idx
                                                          ? 'border-blue-700 bg-blue-600 text-white'
                                                          : selectedAnswers[mcq.id] !== undefined
                                                            ? 'border-blue-300 bg-blue-100 text-blue-700'
                                                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                                                }`}
                                            >
                                                {idx + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-6 space-y-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded bg-blue-600"></div>
                                            <span className="text-gray-600">Current</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded border-2 border-blue-300 bg-blue-100"></div>
                                            <span className="text-gray-600">Answered</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded border-2 border-gray-300 bg-white"></div>
                                            <span className="text-gray-600">Not Answered</span>
                                        </div>
                                        {showResults && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded bg-green-500"></div>
                                                    <span className="text-gray-600">Correct</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded bg-red-500"></div>
                                                    <span className="text-gray-600">Incorrect</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {!showResults && (
                                        <div className="mt-6 border-t pt-4">
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex justify-between">
                                                    <span>Answered:</span>
                                                    <span className="font-semibold">{Object.keys(selectedAnswers).length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Not Answered:</span>
                                                    <span className="font-semibold">{totalQuestions - Object.keys(selectedAnswers).length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </MainSectionWithoutSidebarLayout>
            </PublicLayout>
        </>
    );
};

export default PPSCPaperDemo;

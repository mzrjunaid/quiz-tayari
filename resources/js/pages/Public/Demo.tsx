import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { MainSectionWithoutSidebarLayout } from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react';
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
    const [attemptedQuestion, setAttemptedQuestion] = useState<number>(0);
    // const [wrongAnswered, setWrongAnswered] = useState<number>(0);
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
            setAttemptedQuestion((p) => p + 1);
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

    const score = calculateScore();
    const totalQuestions: number = sampleMCQs.length;
    const percentage: string = ((score / totalQuestions) * 100).toFixed(1);

    const retakeExam = () => {
        setSelectedAnswers({});
        setShowResults(false);
        setCurrentQuestion(0);
        setIsPaused(false);
        setTimeRemaining(1800);
        setShowExplanation({});
        setAttemptedQuestion(0);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Homepage', href: route('home') },
        { title: 'Demo', href: route('demo') },
    ];

    return (
        <>
            <Head title="PPSC Practice Paper"></Head>
            <PublicLayout>
                {/* Header */}
                <MainSectionWithoutSidebarLayout>
                    {/* Header */}
                    <div className="mx-auto max-w-7xl">
                        {!showResults ? (
                            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                                {/* Header Section */}
                                <div className="border-b bg-primary/50 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                                            <h2 className="text-xl font-bold md:text-3xl">PPSC Practice Paper</h2>
                                            <p className="mt-0.5 text-sm font-medium">General Knowledge & Aptitude Test</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-primary-foreground">
                                                <Clock className="h-5 w-5" />
                                                <span className="font-mono text-lg font-semibold">{formatTime(timeRemaining)}</span>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                onClick={handleSubmit}
                                                // className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="p-6 md:p-8">
                                    {/* Question Header */}
                                    <div className="mb-6">
                                        <p className="mb-2 text-sm font-medium text-muted">
                                            Question {currentQuestion + 1} of {totalQuestions}
                                            {selectedAnswers[sampleMCQs[currentQuestion].id] !== undefined && (
                                                <span className="ms-2 animate-pulse text-destructive-foreground italic">(Question Locked)</span>
                                            )}
                                        </p>
                                        <h3 className="text-lg leading-relaxed font-semibold">{sampleMCQs[currentQuestion].question}</h3>
                                    </div>

                                    {/* Options Grid - 2x2 Layout */}
                                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {sampleMCQs[currentQuestion].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswerSelect(sampleMCQs[currentQuestion].id, idx)}
                                                className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                                    selectedAnswers[sampleMCQs[currentQuestion].id] === idx
                                                        ? 'border-primary bg-gray-50 shadow-md'
                                                        : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                                                } ${
                                                    selectedAnswers[sampleMCQs[currentQuestion].id] !== undefined
                                                        ? 'cursor-not-allowed opacity-60'
                                                        : ''
                                                }`}
                                                disabled={selectedAnswers[sampleMCQs[currentQuestion].id] !== undefined}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-2 border-gray-300 bg-white font-semibold text-gray-700">
                                                        {String.fromCharCode(65 + idx)}.
                                                    </div>
                                                    <span className="font-medium text-gray-800">{option}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Question Navigation */}
                                    <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                                            disabled={currentQuestion === 0}
                                        >
                                            Prev
                                        </Button>

                                        {sampleMCQs.map((_, idx) => (
                                            <Button
                                                variant="default"
                                                key={idx}
                                                onClick={() => setCurrentQuestion(idx)}
                                                className={`h-10 w-10 rounded-lg font-semibold transition-all ${
                                                    currentQuestion === idx
                                                        ? 'bg-primary text-white'
                                                        : selectedAnswers[sampleMCQs[idx].id] !== undefined
                                                          ? 'bg-primary/35 text-foreground hover:bg-primary/65'
                                                          : 'border border-gray-200 bg-white text-primary hover:border-primary hover:text-white'
                                                }`}
                                            >
                                                {idx + 1}
                                            </Button>
                                        ))}

                                        <Button
                                            variant="default"
                                            onClick={() => setCurrentQuestion((prev) => Math.min(totalQuestions - 1, prev + 1))}
                                            disabled={currentQuestion === totalQuestions - 1}
                                            // className="rounded-lg bg-primary px-5 py-2 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Results View */
                            <div className="space-y-6">
                                {/* Score Card */}
                                <div className="rounded-2xl bg-white p-8 shadow-2xl">
                                    <div className="mb-8 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
                                            <p className="mt-1 text-sm text-gray-600">PPSC Practice Paper - Demo</p>
                                        </div>
                                        <div className="relative h-32 w-32">
                                            <svg className="h-32 w-32 -rotate-90 transform">
                                                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="#1f2937"
                                                    strokeWidth="12"
                                                    fill="none"
                                                    strokeDasharray={`${(Number(percentage) / 100) * 351.86} 351.86`}
                                                    className="transition-all duration-1000"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-3xl font-bold text-gray-900">
                                                        {score}/{totalQuestions}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <div className="rounded-xl bg-blue-50 p-4 text-center">
                                            <p className="mb-1 text-sm text-gray-600">Total Questions</p>
                                            <p className="text-2xl font-bold text-blue-700">{totalQuestions}</p>
                                        </div>
                                        <div className="rounded-xl bg-purple-50 p-4 text-center">
                                            <p className="mb-1 text-sm text-gray-600">Attempted</p>
                                            <p className="text-2xl font-bold text-purple-700">{attemptedQuestion}</p>
                                        </div>
                                        <div className="rounded-xl bg-green-50 p-4 text-center">
                                            <p className="mb-1 text-sm text-gray-600">Score</p>
                                            <p className="text-2xl font-bold text-green-700">{score - (attemptedQuestion - score) * 0.25}</p>
                                        </div>
                                        <div className="rounded-xl bg-red-50 p-4 text-center">
                                            <p className="mb-1 text-sm text-gray-600">Not Attempted</p>
                                            <p className="text-2xl font-bold text-red-700">{totalQuestions - attemptedQuestion}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                                        <p className="text-center text-lg font-semibold text-gray-900">
                                            {Number(percentage) >= 70
                                                ? '🎉 Excellent Performance!'
                                                : Number(percentage) >= 50
                                                  ? '👍 Good Attempt!'
                                                  : '💪 Keep Practicing!'}
                                        </p>
                                        <div>
                                            <Button variant="link" onClick={retakeExam}>
                                                <RotateCcw />
                                                Repeat
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Answers */}
                                <div className="rounded-2xl bg-white p-8 shadow-2xl">
                                    <h3 className="mb-6 text-xl font-bold text-gray-900">Detailed Review</h3>
                                    <div className="space-y-4">
                                        {sampleMCQs.map((mcq, idx) => {
                                            const isCorrect: boolean = selectedAnswers[mcq.id] === mcq.correctAnswer;
                                            const wasAnswered: boolean = selectedAnswers[mcq.id] !== undefined;

                                            return (
                                                <div
                                                    key={mcq.id}
                                                    className={`rounded-xl border-2 p-5 ${
                                                        isCorrect
                                                            ? 'border-green-200 bg-green-50'
                                                            : wasAnswered
                                                              ? 'border-red-200 bg-red-50'
                                                              : 'border-gray-200 bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {isCorrect ? (
                                                            <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                                                        ) : wasAnswered ? (
                                                            <XCircle className="mt-1 h-6 w-6 flex-shrink-0 text-red-600" />
                                                        ) : (
                                                            <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-gray-400" />
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="mb-3 font-semibold text-gray-900">
                                                                Question {idx + 1}: {mcq.question}
                                                            </p>

                                                            <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                                                {mcq.options.map((opt, optIdx) => (
                                                                    <div
                                                                        key={optIdx}
                                                                        className={`rounded-lg border-2 p-3 ${
                                                                            optIdx === mcq.correctAnswer
                                                                                ? 'border-green-500 bg-green-50'
                                                                                : wasAnswered && optIdx === selectedAnswers[mcq.id] && !isCorrect
                                                                                  ? 'border-red-500 bg-red-50'
                                                                                  : 'border-gray-200 bg-white'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-semibold text-gray-700">
                                                                                {String.fromCharCode(65 + optIdx)}.
                                                                            </span>
                                                                            <span className="text-gray-800">{opt}</span>
                                                                            {optIdx === mcq.correctAnswer && (
                                                                                <span className="ml-auto text-xs font-semibold text-green-600">
                                                                                    ✓ Correct
                                                                                </span>
                                                                            )}
                                                                            {wasAnswered && optIdx === selectedAnswers[mcq.id] && !isCorrect && (
                                                                                <span className="ml-auto text-xs font-semibold text-red-600">
                                                                                    ✗ Your answer
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {!wasAnswered && <p className="mb-3 text-sm text-gray-600 italic">Not attempted</p>}

                                                            <Button
                                                                variant={'link'}
                                                                onClick={() => toggleExplanation(mcq.id)}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 !p-0"
                                                            >
                                                                {showExplanation[mcq.id] ? '− Hide' : '+ Show'} Explanation
                                                            </Button>

                                                            {showExplanation[mcq.id] && (
                                                                <div className="mt-3 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                                                                    <p className="mb-1 text-sm font-semibold text-blue-900">Explanation:</p>
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
                </MainSectionWithoutSidebarLayout>
            </PublicLayout>
        </>
    );
};

export default PPSCPaperDemo;

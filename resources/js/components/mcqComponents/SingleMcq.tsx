import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from '@inertiajs/react';
import { Bot, ChevronDown, ChevronUp, Eye, Share2, Tag } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// TypeScript interfaces
interface MCQ {
    id: string | number;
    question: string;
    options: string[];
    correctAnswer: number;
    subject: string;
    difficulty: string;
    views: number;
    aiEnhanced: boolean;
    tags: string[];
    explanation?: string;
    testService: string;
}

interface MCQComponentProps {
    mcq?: MCQ;
    index?: number;
    mcqMode: boolean;
}

// Mock data for demonstration
const mockMCQ: MCQ = {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    subject: 'Geography',
    difficulty: 'Easy',
    views: 1234,
    aiEnhanced: true,
    tags: ['Europe', 'Capitals', 'Geography Basics', 'london', 'new york', 'USA'],
    explanation:
        'Paris is the capital and most populous city of France. It has been the capital since the 6th century and is located in the north-central part of the country along the Seine River.',
    testService: 'GATE',
};

const McqCard: React.FC<MCQComponentProps> = ({ mcq = mockMCQ, index = 0, mcqMode }) => {
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    // Handle mcqMode changes
    useEffect(() => {
        if (!mcqMode) {
            // Reading mode: preselect the correct answer
            setSelectedAnswer(mcq.correctAnswer);
            setShowExplanation(true); // Optionally show explanation in reading mode
        } else {
            // Quiz mode: clear selection and hide explanation
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    }, [mcqMode, mcq.correctAnswer]);

    const handleOptionSelect = (optIndex: number): void => {
        // Only allow selection in quiz mode
        if (!mcqMode) return;

        setSelectedAnswer(optIndex);
        // Optionally show explanation after selection in quiz mode
        if (optIndex !== null) {
            setShowExplanation(true);
        }
    };

    const getOptionClasses = (optIndex: number): string => {
        const baseClasses = 'flex items-center space-x-3 rounded-md p-3 text-sm transition-all duration-200';

        // Add cursor style based on mode
        const cursorClass = mcqMode ? 'cursor-pointer' : 'cursor-default';

        if (mcqMode) {
            // Quiz mode: original logic
            if (selectedAnswer === null) {
                return `${baseClasses} ${cursorClass} bg-gray-50 hover:bg-gray-100 border border-transparent`;
            }

            if (optIndex === mcq.correctAnswer) {
                return `${baseClasses} ${cursorClass} bg-green-50 border-2 border-green-200 hover:bg-green-100`;
            } else if (optIndex === selectedAnswer && optIndex !== mcq.correctAnswer) {
                return `${baseClasses} ${cursorClass} bg-red-50 border-2 border-red-200 hover:bg-red-100`;
            } else {
                return `${baseClasses} ${cursorClass} bg-gray-50 opacity-60 border border-transparent`;
            }
        } else {
            // Reading mode: show correct answer highlighted, others dimmed
            if (optIndex === mcq.correctAnswer) {
                return `${baseClasses} ${cursorClass} bg-green-50 border-2 border-green-200`;
            } else {
                return `${baseClasses} ${cursorClass} bg-gray-50 opacity-50 border border-transparent`;
            }
        }
    };

    const getDifficultyBadgeVariant = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-700 hover:bg-green-200';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
            case 'Hard':
                return 'bg-red-100 text-red-700 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        }
    };

    return (
        <Card className="transition-shadow hover:shadow-lg">
            <CardContent className="p-4 md:p-6">
                {/* Header with Subject and Share */}
                <div className="mb-2 flex items-center justify-between md:mb-4">
                    <div className="flex items-center space-x-2">
                        <Badge variant="default" className="bg-black text-white hover:bg-gray-800">
                            <span className="max-w-26 truncate md:max-w-36">{mcq.subject}</span>
                        </Badge>
                        {mcq.aiEnhanced && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                <Bot className="mr-1 h-3 w-3" />
                                AI
                            </Badge>
                        )}
                        {/* Mode indicator */}
                        <Badge variant="outline" className={mcqMode ? 'border-red-300 text-red-700' : 'border-green-300 text-green-700'}>
                            {mcqMode ? '📝 Quiz' : '📖 Study'}
                        </Badge>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#">
                            <Share2 />
                        </Link>
                    </Button>
                </div>

                {/* Tags Section */}
                {mcq.tags && (
                    <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center md:mb-4">
                        <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Tags:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {mcq.tags.map((tag: string, tagIndex: number) => (
                                <Badge key={tagIndex} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    <span className="max-w-20 truncate">{tag}</span>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Question */}
                <h4 className="mb-2 text-lg font-semibold text-black md:mb-4">
                    Q{index + 1}. {mcq.question}
                </h4>

                {/* Mode instruction
                {!mcqMode && (
                    <p className="mb-3 rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                        📖 Study Mode: The correct answer is highlighted in green
                    </p>
                )} */}

                {/* Options */}
                <div className="mb-2 grid gap-2 sm:grid-cols-2 sm:gap-3 md:mb-4">
                    {mcq.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className={getOptionClasses(optIndex)} onClick={() => handleOptionSelect(optIndex)}>
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white">
                                <span className="text-xs font-medium text-gray-600">{String.fromCharCode(65 + optIndex)}</span>
                            </div>
                            <span className="flex-1 text-gray-700 font-semibold">{option}</span>

                            {/* Show correct indicator */}
                            {((mcqMode && selectedAnswer !== null) || !mcqMode) && optIndex === mcq.correctAnswer && (
                                <Badge variant="secondary" className="bg-green-100 text-xs text-green-700">
                                    ✓ Correct
                                </Badge>
                            )}

                            {/* Show selected indicator in quiz mode */}
                            {mcqMode && selectedAnswer === optIndex && optIndex !== mcq.correctAnswer && (
                                <Badge variant="secondary" className="bg-red-100 text-xs text-red-700">
                                    ✗ Wrong
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>

                {/* MCQ Explanation Accordion */}
                {mcq.explanation && (
                    <div className="mb-2 border-t border-gray-200 pt-2 md:mb-4 md:pt-4">
                        <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="h-auto w-full justify-between">
                                    <span className="text-sm font-medium text-gray-700">Explanation</span>
                                    {showExplanation ? (
                                        <ChevronUp className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1 md:mt-3">
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <p className="text-sm leading-relaxed text-gray-700">{mcq.explanation}</p>
                                    {mcqMode && selectedAnswer !== null && (
                                        <div className="mt-3 border-t border-blue-200 pt-3">
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    selectedAnswer === mcq.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }
                                            >
                                                {selectedAnswer === mcq.correctAnswer
                                                    ? '🎉 Excellent! You got it right!'
                                                    : `❌ The correct answer is option ${String.fromCharCode(65 + mcq.correctAnswer)}.`}
                                            </Badge>
                                        </div>
                                    )}
                                    {!mcqMode && (
                                        <div className="mt-3 border-t border-blue-200 pt-3">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                📚 Correct answer: Option {String.fromCharCode(65 + mcq.correctAnswer)}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-2 md:pt-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <Eye className="mr-1 inline h-4 w-4" />
                            {mcq.views}
                        </span>
                        <Badge variant="secondary" className={getDifficultyBadgeVariant(mcq.difficulty)}>
                            {mcq.difficulty}
                        </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                        {mcq.testService && (
                            <Badge variant="outline" className="font-semibold">
                                {mcq.testService}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default McqCard;

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mcqs, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bot, ChevronDown, ChevronUp, Share2, Tag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import OptionsComponent from './question-component';

const QuestionType: Record<string, string> = {
    single: 'Single Choice',
    multiple: 'Multiple Choice',
    true_false: 'True/False',
    single_a: 'Single Answer',
};

// Mock data for demonstration
const mockMCQ: Mcqs = {
    id: '35654633-1c33-4604-ac42-1d07d03ebb44',
    serial_number: null,
    slug: 'on-what-date-did-yasser-arafat-the-first-president-of-the-palestinian-authority-pass-away',
    question: 'On what date did Yasser Arafat, the first president of the Palestinian Authority, pass away?',
    explanation:
        'Yasser Arafat, a key figure in the Palestinian liberation movement and the first President of the Palestinian Authority, died on November 11, 2004. His death marked a significant turning point in Palestinian politics and the peace process with Israel. The circumstances surrounding his death have been subject to much speculation and debate.',
    options: {
        A: '11th September 2006',
        B: '9th November 2001',
        C: '12th December 2007',
        D: '11th November 2004',
    },
    correct_answer: null,
    correct_answers: ['B', 'C', 'A'],
    subject: 'General Knowledge',
    topic: 'World History, Middle East Politics',
    difficulty_level: 'medium',
    question_type: 'multiple',
    tags: ['History', 'Politics', 'Middle East', 'Palestine', 'Yasser Arafat'],
    exam_types: ['CSS', 'PMS', 'NTS', 'FPSC', 'PPSC', 'UPSC', 'GRE', 'GMAT'],
    is_active: true,
    is_verified: false,
    paper: {
        id: '0199756e-d96a-73ea-bd00-5fcdd4443dcc',
        serial_number: null,
        slug: 'necessitatibus-iste',
        title: 'Necessitatibus iste.',
        description: 'Ipsam qui ipsum fugit quasi excepturi porro et harum cumque aliquid.',
        testing_service: {
            short: 'TOEFL',
            long: 'Test of English as a Foreign Language',
        },
        department: 'Punjab University',
        subject: 'Computer Science',
        scheduled_at: {
            datetime: '2025-11-05T05:12:12.000000Z',
            human: '1 month from now',
            formatted: 'Nov 5, 2025 at 5:12 AM',
            date_only: '05-11-2025',
            time_only: '05:12',
        },
        status: {
            is_scheduled: true,
            is_today: false,
            is_upcoming: true,
            is_past: false,
        },
        meta: {
            has_description: true,
            has_testing_service: true,
        },
        created_at: {
            datetime: '2025-09-23T07:17:02.000000Z',
            human: '1 hour ago',
            formatted: 'Sep 23, 2025',
        },
        updated_at: {
            datetime: '2025-09-23T07:17:02.000000Z',
            human: '1 hour ago',
            formatted: 'Sep 23, 2025',
        },
    },
    current_affair: false,
    general_knowledge: true,
    language: 'en',
    created_by: {
        id: 1,
        name: 'Junaid Mazhar',
        email: 'mzrjunaid@gmail.com',
    },
    updated_by: {
        id: 1,
        name: 'Junaid Mazhar',
        email: 'mzrjunaid@gmail.com',
    },
    verified_by: null,
    created_at: '2025-09-23T07:18:13.000000Z',
    updated_at: '2025-09-23T07:18:13.000000Z',
    deleted_at: null,
    created_at_human: '1 hour ago',
    updated_at_human: '1 hour ago',
    deleted_at_human: null,
    created_at_datetime: 'Sep 23, 2025 07:18 AM',
    updated_at_datetime: 'Sep 23, 2025 07:18 AM',
    deleted_at_datetime: null,
    has_multiple_correct_answers: true,
    option_count: 4,
    status: 'Pending Verification',
};

interface MCQComponentProps {
    mcq?: Mcqs;
    index?: number;
}

const McqCard: React.FC<MCQComponentProps> = ({ mcq = mockMCQ }) => {
    const { mcqMode } = usePage<SharedData>().props;
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [disabled, setDisabled] = useState(false);
    const isMobile = useIsMobile();

    const optionEntries = Object.entries(mcq?.options || {});

    const mcqUrl = mcq.paper
        ? route('public.papers.mcqs.show', {
              paper: mcq.paper?.slug,
              mcq: mcq.slug,
          })
        : route('public.mcqs.show', mcq.slug);

    const correctAnswers = React.useMemo(() => {
        let answers = mcq?.correct_answers;

        if (typeof answers === 'string') {
            try {
                answers = JSON.parse(answers);
            } catch {
                answers = [];
            }
        }

        if (Array.isArray(answers) && answers.length > 0) {
            return answers;
        }

        return mcq?.correct_answer ? [mcq.correct_answer] : [];
    }, [mcq?.correct_answers, mcq?.correct_answer]);

    // Reset on mode change
    useEffect(() => {
        if (!mcq) return;

        if (!mcqMode) {
            // Study mode: preselect correct answers
            setSelectedAnswers(correctAnswers);
            setShowExplanation(true);
            setDisabled(true);
        } else {
            // Quiz mode: reset
            setSelectedAnswers([]);
            setShowExplanation(false);
            setDisabled(false);
        }
    }, [mcqMode, mcq, correctAnswers]);

    const getDifficultyBadgeVariant = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 py-1 text-green-700 hover:bg-green-200';
            case 'medium':
                return 'bg-yellow-100 py-1 text-yellow-700 hover:bg-yellow-200';
            case 'hard':
                return 'bg-red-100 py-1 text-red-700 hover:bg-red-200';
            default:
                return 'bg-gray-100 py-1 text-gray-700 hover:bg-gray-200';
        }
    };

    return (
        <Card className="border-0 bg-card transition-shadow hover:shadow-lg">
            <CardHeader>
                {/* Header with Subject and Share */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 space-x-2">
                        <Badge variant="default" asChild>
                            <Link href="#" title={`View all Papers from ${mcq.subject}`}>
                                <span className="max-w-26 truncate md:max-w-36">{mcq?.subject}</span>
                            </Link>
                        </Badge>
                        <Badge variant="secondary">
                            <Bot className="mr-1 h-3 w-3" />
                            AI
                        </Badge>
                        <Badge variant="outline" className={mcqMode ? 'border-red-400 text-red-500' : 'border-success text-success'}>
                            {mcqMode ? '📝 Quiz' : '📖 Study'}
                        </Badge>
                        {mcq?.difficulty_level && (
                            <Badge variant="secondary" className={getDifficultyBadgeVariant(mcq.difficulty_level)}>
                                {mcq.difficulty_level}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                        {mcq.question_type && <Badge variant="secondary">{QuestionType[mcq.question_type]}</Badge>}
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#">
                                <Share2 />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Question */}
                <Link
                    href={mcqUrl}
                    // href="#"
                >
                    <h4 className="mb-2 text-lg font-semibold md:mb-4">
                        Q{mcq?.serial_number}. {mcq?.question}
                    </h4>
                </Link>

                <OptionsComponent
                    optionEntries={optionEntries}
                    mcqMode={mcqMode}
                    question_type={mcq.question_type}
                    disabled={disabled}
                    selectedAnswers={selectedAnswers}
                    setSelectedAnswers={setSelectedAnswers}
                    correctAnswers={correctAnswers}
                    setDisabled={setDisabled}
                    setShowExplanation={setShowExplanation}
                />

                {/* MCQ Explanation */}
                {mcq?.explanation && (
                    <div className="border-t pt-2">
                        <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="h-auto w-full justify-between">
                                    <span className="text-sm font-medium">Explanation</span>
                                    {showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1 md:mt-3">
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <p className="text-sm leading-relaxed text-accent-foreground dark:text-accent">{mcq.explanation}</p>

                                    {/* Quiz Mode Feedback */}
                                    {mcqMode && Array.isArray(selectedAnswers) && selectedAnswers.length > 0 && (
                                        <div className="mt-3 border-t border-blue-200 pt-3">
                                            {Array.isArray(correctAnswers) &&
                                            selectedAnswers.every((ans) => correctAnswers.includes(ans)) &&
                                            correctAnswers.length === selectedAnswers.length ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    🎉 Excellent! You got all correct!
                                                </Badge>
                                            ) : (
                                                Array.isArray(correctAnswers) && (
                                                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                                                        ❌ Correct answers: {correctAnswers.join(', ')}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {/* Study Mode Feedback */}
                                    {!mcqMode && (
                                        <div className="mt-3 border-t border-blue-200 pt-3">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                {Array.isArray(correctAnswers)
                                                    ? `📚 Correct answer(s): ${correctAnswers.join(', ')}`
                                                    : `📚 Correct answer(s): ${correctAnswers}`}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                )}
            </CardContent>

            <CardFooter className="items-center justify-between">
                {/* Tags Section */}
                {!isMobile && mcq?.tags && (
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Tags:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {mcq.tags.map((tag: string, tagIndex: number) => (
                                <Badge key={tagIndex} variant="outline">
                                    <span className="max-w-20 truncate">{tag}</span>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                {/* <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                        <Eye className="mr-1 inline h-4 w-4" />
                        150 Views
                    </span>
                </div> */}

                {mcq?.paper && (
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="px-3 py-1 font-semibold hover:!bg-accent" asChild>
                            <Link href="#">{mcq.paper.testing_service.short}</Link>
                        </Badge>
                        <Badge variant="default" className="hidden px-3 py-1 font-semibold sm:block" asChild>
                            <Link href="#" title={`View all Papers from ${mcq.paper.department}`}>
                                <span className="truncate sm:max-w-26 md:max-w-36">{mcq.paper.department}</span>
                            </Link>
                        </Badge>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default McqCard;

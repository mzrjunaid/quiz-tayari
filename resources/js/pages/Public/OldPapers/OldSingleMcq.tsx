import OptionsComponent from '@/components/mcqComponents/question-component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { OldMcqs, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bot, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MCQComponentProps {
    mcq?: OldMcqs;
    index: number;
}

const OldMcqCard: React.FC<MCQComponentProps> = ({ mcq, index }) => {
    const { mcqMode } = usePage<SharedData>().props;
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [disabled, setDisabled] = useState(false);

    const optionEntries = Object.entries(mcq?.options || {});

    const correctAnswers = React.useMemo(() => {
        let answers = mcq?.correct_answer;

        if (typeof answers === 'string') {
            try {
                answers = JSON.parse(answers);
            } catch (error) {
                // Not a JSON string, keep as is
                console.log('Error parsing correct_answer JSON:', error);
            }
        }

        if (Array.isArray(answers) && answers.length > 0) {
            return answers;
        }

        return mcq?.correct_answer ? [mcq.correct_answer] : [];
    }, [mcq?.correct_answer]);

    // Reset on mode change
    useEffect(() => {
        if (!mcq) return;

        if (!mcqMode) {
            // Study mode: preselect correct answers
            setSelectedAnswers(correctAnswers);
            setDisabled(true);
        } else {
            // Quiz mode: reset
            setSelectedAnswers([]);
            setDisabled(false);
        }
    }, [mcqMode, mcq, correctAnswers]);

    return (
        <Card className="border-0 bg-card transition-shadow hover:shadow-lg">
            <CardHeader>
                {/* Header with Subject and Share */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 space-x-2">
                        {mcq?.subject?.title && (
                            <Badge variant="default" asChild>
                                <Link href="#" title={`View all Papers from ${mcq?.subject?.title}`}>
                                    <span className="max-w-26 truncate md:max-w-36">{mcq?.subject?.title}</span>
                                </Link>
                            </Badge>
                        )}
                        <Badge variant="secondary">
                            <Bot className="mr-1 h-3 w-3" />
                            AI
                        </Badge>
                        <Badge variant="outline" className={mcqMode ? 'border-red-400 text-red-500' : 'border-success text-success'}>
                            {mcqMode ? '📝 Quiz' : '📖 Study'}
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Badge variant="secondary">single</Badge>
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
                <Link href={route('public.mcqs.show', mcq?.slug)}>
                    <h4 className="mb-2 text-lg font-semibold md:mb-4">
                        Q{index}. {mcq?.question}
                    </h4>
                </Link>

                <OptionsComponent
                    optionEntries={optionEntries}
                    mcqMode={mcqMode}
                    question_type={'single'}
                    disabled={disabled}
                    selectedAnswers={selectedAnswers}
                    setSelectedAnswers={setSelectedAnswers}
                    correctAnswers={correctAnswers}
                    setDisabled={setDisabled}
                    setShowExplanation={setShowExplanation}
                />
            </CardContent>

            <CardFooter className="items-center justify-between">
                {mcq?.paper && (
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="px-3 py-1 font-semibold hover:!bg-accent" asChild>
                            <Link href="#">{mcq.testing_service?.title}</Link>
                        </Badge>
                        {mcq.paper.department && (
                            <Badge variant="default" className="hidden px-3 py-1 font-semibold sm:block" asChild>
                                <Link href="#" title={`View all Papers from ${mcq.paper.department}`}>
                                    <span className="truncate sm:max-w-26 md:max-w-36">{mcq.paper.department}</span>
                                </Link>
                            </Badge>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default OldMcqCard;

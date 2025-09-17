import { Bot, Eye, Target } from 'lucide-react';

interface Props {
    sampleMCQs: {
        id: number;
        question: string;
        options: string[];
        correctAnswer: number;
        subject: string;
        difficulty: string;
        views: number;
        attempts: number;
        successRate: number;
        aiEnhanced: boolean;
        tags: string[];
        testService: string;
    }[];
    currentMCQ: number;
}

export default function HeroMcqPreview({ sampleMCQs, currentMCQ }: Props) {
    {
        /* Live MCQ Preview */
    }
    return (
        <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:bg-gray-700 dark:text-foreground">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-foreground">Live MCQ Preview</span>
                    </div>
                    {sampleMCQs[currentMCQ].aiEnhanced && (
                        <div className="flex items-center space-x-1 rounded-full bg-gray-900 px-3 py-1 text-xs text-white">
                            <Bot className="h-3 w-3" />
                            <span>AI Enhanced</span>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <div className="mb-3 flex items-center space-x-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{sampleMCQs[currentMCQ].subject}</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {sampleMCQs[currentMCQ].difficulty}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {sampleMCQs[currentMCQ].testService}
                        </span>
                    </div>

                    <h3 className="mb-4 text-lg font-semibold text-black">
                        Q{currentMCQ + 1}. {sampleMCQs[currentMCQ].question}
                    </h3>

                    <div className="space-y-3">
                        {sampleMCQs[currentMCQ].options.map((option, index) => (
                            <div
                                key={index}
                                className="flex cursor-pointer items-center space-x-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300">
                                    <span className="text-sm font-medium text-gray-600">{String.fromCharCode(65 + index)}</span>
                                </div>
                                <span className="text-gray-800">{option}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span>
                            <Eye className="mr-1 inline h-4 w-4" />
                            {sampleMCQs[currentMCQ].views}
                        </span>
                        <span>
                            <Target className="mr-1 inline h-4 w-4" />
                            {sampleMCQs[currentMCQ].attempts}
                        </span>
                    </div>
                    <span className="font-medium text-green-600">{sampleMCQs[currentMCQ].successRate}% Success Rate</span>
                </div>
            </div>
        </div>
    );
}

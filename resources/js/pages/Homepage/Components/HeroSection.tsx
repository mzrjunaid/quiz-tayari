import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Eye, LucideIcon, Play } from 'lucide-react';
import HeroMcqPreview from './HeroMcqCard';

interface Props {
    stats: { number: string; label: string; icon: LucideIcon }[];
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

export default function HeroSection({ stats, currentMCQ, sampleMCQs }: Props) {
    return (
        <section className="bg-gray-50 px-4 pt-6 pb-16 sm:px-6 md:pt-24 lg:px-8 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-6 bg-black text-white dark:bg-gray-600">
                            <Bot />
                            AI-Enhanced Learning
                        </Badge>

                        <h1 className="mb-6 text-3xl leading-tight font-bold text-foreground md:text-5xl lg:text-6xl">
                            Master MCQs with
                            <span className="block text-gray-600 dark:text-gray-400">Intelligent Practice</span>
                        </h1>

                        <p className="mb-8 text-sm leading-relaxed text-gray-600 md:text-xl dark:text-gray-200">
                            Access thousands of AI-enhanced multiple choice questions across subjects, jobs, and testing services. Practice smarter,
                            not harder.
                        </p>

                        <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <Button
                                className="flex items-center justify-center space-x-2 rounded-lg px-8 py-4 text-lg font-semibold transition-all dark:bg-gray-200"
                                variant="default"
                                size="lg"
                            >
                                <Play className="h-5 w-5" />
                                Start Practicing
                            </Button>
                            {/* <button className="flex items-center justify-center space-x-2 rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-gray-800">
                                <Play className="h-5 w-5" />
                                <span>Start Practicing</span>
                            </button> */}
                            <Button
                                className="flex items-center justify-center space-x-2 rounded-lg px-8 py-4 text-lg font-semibold text-foreground transition-all dark:border-foreground dark:bg-gray-600"
                                variant="outline"
                                size="lg"
                            >
                                <Eye className="h-5 w-5" />
                                View Demo
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {stats.slice(0, 2).map((stat, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-gray-200 bg-white p-4 text-center text-gray-600 dark:bg-gray-700 dark:text-foreground"
                                >
                                    <div className="mb-2 flex items-center justify-center">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div className="font-bold text-black md:text-xl dark:text-white">{stat.number}</div>
                                    <div className="text-xs md:text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <HeroMcqPreview currentMCQ={currentMCQ} sampleMCQs={sampleMCQs} />
                </div>
            </div>
        </section>
    );
}

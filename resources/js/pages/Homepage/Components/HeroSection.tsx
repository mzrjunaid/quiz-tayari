import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Eye, LucideIcon, Play } from 'lucide-react';
import HeroMcqPreview from './HeroMcqCard';

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
interface Props {
    stats: { number: string; label: string; icon: LucideIcon }[];
    sampleMCQs: MCQ[];
    currentMCQ: number;
}

export default function HeroSection({ stats, currentMCQ, sampleMCQs }: Props) {
    return (
        <section className="px-4 pt-6 pb-12 sm:px-6 md:pt-12 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-6">
                            <Bot />
                            AI-Enhanced Learning
                        </Badge>

                        <h1 className="mb-6 text-3xl leading-tight font-bold text-foreground md:text-5xl lg:text-6xl">
                            Master MCQs with
                            <span className="block text-muted-foreground">Intelligent Practice</span>
                        </h1>

                        <p className="mb-8 text-sm leading-relaxed md:text-xl">
                            Access thousands of AI-enhanced multiple choice questions across subjects, jobs, and testing services. Practice smarter,
                            not harder.
                        </p>

                        <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <Button className="py-4 text-lg font-semibold transition-all md:!px-8" variant="default" size="lg">
                                <Play className="h-5 w-5" />
                                Start Practicing
                            </Button>
                            <Button className="py-4 text-lg font-semibold transition-all md:!px-8" variant="outline" size="lg">
                                <Eye className="h-5 w-5" />
                                View Demo
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {stats.slice(0, 2).map((stat, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-accent border-accent text-accent-foreground p-4 text-center shadow-xl dark:border-white/20 dark:bg-white/20"
                                >
                                    <div className="mb-2 flex items-center justify-center">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div className="font-bold md:text-xl">{stat.number}</div>
                                    <div className="text-xs md:text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <HeroMcqPreview currentMCQ={currentMCQ} sampleMCQs={sampleMCQs} mcqMode={true} />
                </div>
            </div>
        </section>
    );
}

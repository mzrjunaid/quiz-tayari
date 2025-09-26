import { features, mostRepeatingMCQs, stats } from '@/constants/features';
import { Link } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
    children?: React.ReactNode;
    feature?: boolean;
    mostRepeatingMCQ?: boolean;
    stat?: boolean;
    className?: string;
}

export default function PageSidebar({ children, feature = true, mostRepeatingMCQ = true, stat = true, className }: Props) {
    return (
        <div className={`space-y-8 ${className}`}>
            {children}

            {/* Features Overview */}
            {feature && (
                <div className="rounded-lg bg-card p-6 shadow-md dark:bg-card">
                    <h3 className="mb-4 text-lg font-semibold">Platform Features</h3>
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-black">
                                    <feature.icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">{feature.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Most Repeating MCQs */}
            {mostRepeatingMCQ && (
                <div className="rounded-lg bg-card p-4 shadow-md md:p-6">
                    <h3 className="mb-2 flex items-center text-lg font-semibold md:mb-4">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Most Repeating MCQs
                    </h3>
                    <div className="space-y-3">
                        {mostRepeatingMCQs.map((mcq, index) => (
                            <div key={index} className="mb:pb-3 overflow-hidden border-b border-gray-100 pb-2 last:border-b-0">
                                <Link href="#" className="text-sm font-semibold whitespace-normal hover:underline">
                                    {mcq.question}
                                </Link>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="max-w-40 truncate text-xs text-gray-500 dark:text-gray-300">{mcq.subject}</span>
                                    <span className="text-xs text-gray-600 dark:text-gray-300">{mcq.attempts.toLocaleString()} attempts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="mt-2 w-full md:mt-4">
                        View All Trending
                    </Button>
                </div>
            )}

            {/* Quick Stats */}
            {stat && (
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
            )}
        </div>
    );
}

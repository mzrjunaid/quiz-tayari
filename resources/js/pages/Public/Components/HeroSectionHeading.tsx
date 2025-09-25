import { Breadcrumbs } from '@/components/breadcrumbs';
import { BreadcrumbItem } from '@/types';
import { Star, TrendingUp, Zap } from 'lucide-react';

interface Props {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    showAds?: boolean;
    className?: string;
    subtitle?: string;
    adSlot?: React.ReactNode;
}

const HeroSectionHeading: React.FC<Props> = ({ title, breadcrumbs, showAds = true, className, subtitle, adSlot }) => {
    return (
        <section className={`relative overflow-hidden py-6 lg:py-8 ${className}`}>
            {/* Background with gradient and pattern */}
            <div className={`absolute inset-0 bg-background backdrop-blur-3xl`}>
                <div className="absolute inset-0"></div>
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, black 2px, transparent 2px)`,
                            backgroundSize: '60px 60px',
                        }}
                    ></div>
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
                    {/* Right Side - Main Content */}
                    <div className="order-1 flex-1 lg:order-1">
                        {/* Breadcrumbs */}
                        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}

                        {/* Main Content */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-4xl leading-tight font-bold lg:text-5xl xl:text-6xl">{title}</h1>
                                {subtitle && <p className="max-w-4xl text-xl leading-relaxed font-light text-gray-500 lg:text-2xl">{subtitle}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Left Side - Ads (when available) */}
                    {showAds && (
                        <div className="order-2 lg:max-w-180 lg:flex-shrink-0">
                            <div className="overflow-hidden rounded-2xl border border-white/20 bg-card shadow-xl backdrop-blur-sm">
                                {adSlot ? (
                                    <div className="p-6">{adSlot}</div>
                                ) : (
                                    <div className="p-6">
                                        <div className="space-y-4 text-center">
                                            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent shadow-lg`}>
                                                <TrendingUp className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold">Featured Content</h3>
                                            <p className="text-sm leading-relaxed">Discover trending Papers and MCQs tailored just for you by AI.</p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    <span>Premium Tests</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <Zap className="h-3 w-3 text-orange-500" />
                                                    <span>Updated Daily</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroSectionHeading;

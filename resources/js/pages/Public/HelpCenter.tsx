import PageTitle from '@/components/public-page-title';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Homepage', href: route('home') },
    { title: 'Help Center', href: route('help.center') },
];

const HelpCenter: React.FC = () => {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is PAK QUIZ and how does it work?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'PAK QUIZ is an online platform that helps job seekers in Pakistan prepare for competitive exams such as PPSC, FPSC, NTS, PTS, and others. It offers a large collection of MCQs across multiple categories, demo practice papers, and premium features like custom quizzes and progress tracking.',
                },
            },
            {
                '@type': 'Question',
                name: 'How can I practice MCQs for PPSC, FPSC, and other tests?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Go to the MCQs section on PAK QUIZ, choose a category (such as General Knowledge, English, Mathematics, Islamiat, or Current Affairs), and start practicing. You can also attempt demo practice papers or create custom quizzes as a premium user.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is PAK QUIZ free to use?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. PAK QUIZ is free to use for basic features like MCQs, demo papers, and job ads. Premium membership unlocks custom quiz creation, detailed explanations, performance tracking, and unlimited practice papers.',
                },
            },
            {
                '@type': 'Question',
                name: 'What is included in the premium membership?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Premium members get access to custom practice papers, progress tracking, detailed explanations, and priority updates. This helps candidates prepare more effectively for competitive exams.',
                },
            },
            {
                '@type': 'Question',
                name: 'How do I create a custom practice paper?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: "Custom papers are available for premium users. After logging in, go to 'Create Paper', select categories, choose the number of questions, and start your test to simulate a real exam environment.",
                },
            },
            {
                '@type': 'Question',
                name: 'Can I track my progress on PAK QUIZ?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Premium members can track scores, review mistakes, and monitor progress over time. This feature helps identify strengths and weaknesses.',
                },
            },
            {
                '@type': 'Question',
                name: 'Do you provide explanations for answers?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Many MCQs include detailed explanations so learners can understand the reasoning. Explanations are fully available to premium users.',
                },
            },
            {
                '@type': 'Question',
                name: 'How often are job ads updated?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Job ads are updated daily. PAK QUIZ covers opportunities from PPSC, FPSC, NTS, PTS, NJP, and private jobs. Filters allow searching by province, district, and city.',
                },
            },
            {
                '@type': 'Question',
                name: 'Do I need to create an account to practice MCQs?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No, you can practice MCQs and demo papers without an account. To save progress, create custom papers, or access premium features, you’ll need to register.',
                },
            },
            {
                '@type': 'Question',
                name: 'Which payment methods are supported for premium plans?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We support Easypaisa, JazzCash, bank transfer, and debit/credit cards. Payments are secure, and premium features unlock immediately after confirmation.',
                },
            },
        ],
    };
    return (
        <>
            <Head title="Help Center">
                <meta
                    name="description"
                    content="Find answers to common questions about PAK QUIZ, MCQs practice, jobs updates, premium membership, and more."
                />
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Head>
            <PublicLayout title="Privacy Policy">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <PageTitle
                        title="Help Center"
                        breadcrumbs={breadcrumbs}
                        subtitle="Find answers to your questions and learn how to use PAK QUIZ effectively"
                    />
                    <HelpCenterPage />
                </div>
            </PublicLayout>
        </>
    );
};

export default HelpCenter;

import { AlertCircle, BookOpen, Briefcase, CheckCircle, CreditCard, HelpCircle, LucideIcon, Mail, Search, Star } from 'lucide-react';
import React, { useState } from 'react';

export function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('faqs');
    // const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const categories = [
        { id: 'faqs', label: 'FAQs', icon: HelpCircle },
        { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
        { id: 'premium', label: 'Premium Features', icon: Star },
        { id: 'jobs', label: 'Jobs & Updates', icon: Briefcase },
        { id: 'billing', label: 'Account & Billing', icon: CreditCard },
        { id: 'support', label: 'Contact & Support', icon: Mail },
    ];

    const faqs = [
        {
            question: 'What is PAK QUIZ and how does it work?',
            answer: 'PAK QUIZ is an online platform that helps job seekers in Pakistan prepare for competitive exams such as PPSC, FPSC, NTS, PTS, and others. It offers a large collection of MCQs across multiple categories, demo practice papers, and premium features like custom quizzes and progress tracking. Users can practice questions daily, stay updated with the latest job ads, and improve their test preparation.',
        },
        {
            question: 'How can I practice MCQs for PPSC, FPSC, and other tests?',
            answer: 'Simply go to the MCQs section on PAK QUIZ, choose a category (such as General Knowledge, English, Mathematics, Islamiat, or Current Affairs), and start practicing. Each question comes with multiple options, and some include detailed explanations. You can also attempt demo practice papers that simulate real exams. Premium users can create their own custom papers based on categories and difficulty levels.',
        },
        {
            question: 'Is PAK QUIZ free to use?',
            answer: 'Yes ✅ PAK QUIZ is free to use for basic features. All users can access the MCQs bank, demo practice papers, and job ads without cost. However, we also offer a premium membership that unlocks advanced features like custom quiz creation, detailed explanations, performance tracking, and unlimited practice papers.',
        },
        {
            question: 'What is included in the premium membership?',
            answer: 'Premium members get full access to: Custom practice papers (choose your categories & number of MCQs), Progress tracking (monitor correct/incorrect answers, history, and improvement), Detailed explanations for selected questions, AI-generated MCQs based on keywords, Random AI-generated practice papers, and Priority updates with additional learning resources. This helps serious candidates prepare more effectively for competitive exams.',
        },
        {
            question: 'How do I create a custom practice paper?',
            answer: 'Custom papers are available for premium users. After logging in, go to Create Paper, select your desired categories (e.g., English, Current Affairs, Mathematics), choose the number of questions, and start the test. This feature allows you to simulate a real exam environment and focus on your weak areas.',
        },
        {
            question: 'Can I track my progress on PAK QUIZ?',
            answer: "Yes. If you're a premium member, every paper you attempt is saved in your account. You can see your score, review mistakes, and check your improvement over time. This feature helps identify your strengths and weaknesses and ensures better preparation for exams.",
        },
        {
            question: 'Do you provide explanations for answers?',
            answer: 'Yes. Many MCQs in PAK QUIZ include detailed explanations so that learners can understand the correct reasoning. This is especially helpful for competitive exams like PPSC, FPSC, and NTS, where understanding concepts is more important than memorization. Explanations are fully available to premium users.',
        },
        {
            question: 'How often are job ads updated?',
            answer: 'We update job ads daily to make sure you never miss an opportunity. PAK QUIZ covers the latest job openings from PPSC, FPSC, NTS, PTS, NJP, and also private sector jobs. You can filter jobs by province, district, and city to find relevant opportunities easily.',
        },
        {
            question: 'Do I need to create an account to practice MCQs?',
            answer: "No, you can start practicing MCQs and demo papers without creating an account. However, if you want to save progress, create custom papers, or access premium features, you'll need to register for a free or premium account. Creating an account also allows you to bookmark questions for later review.",
        },
        {
            question: 'Which payment methods are supported for premium plans?',
            answer: 'We support multiple secure payment methods in Pakistan, including Easypaisa, JazzCash, bank transfer, and debit/credit cards. Payments are processed safely, and once your subscription is confirmed, premium features will be unlocked immediately.',
        },
    ];

    const gettingStartedGuides = [
        {
            title: 'How to create a free account on PAK QUIZ',
            steps: [
                'Click on the "Sign Up" button in the top right corner',
                'Enter your name, email address, and create a password',
                'Verify your email address by clicking the link sent to your inbox',
                'Complete your profile with optional information',
                'Start practicing MCQs immediately!',
            ],
        },
        {
            title: 'How to attempt MCQs online',
            steps: [
                'Navigate to the "MCQs Bank" section from the main menu',
                'Select a category (General Knowledge, English, Math, etc.)',
                'Click on any question to view it',
                'Select your answer from the multiple choices provided',
                'Click "Submit" to see if your answer is correct',
                'Review the explanation (if available) to understand the concept',
            ],
        },
        {
            title: 'How to use demo practice papers',
            steps: [
                'Go to the "Practice Papers" section',
                'Browse available demo papers for different exams',
                'Click "Start Test" on any demo paper',
                'Answer all questions within the time limit',
                'Submit your paper to see your score and correct answers',
                'No account needed for demo papers!',
            ],
        },
        {
            title: 'How to upgrade to premium membership',
            steps: [
                'Log in to your account',
                'Click on "Upgrade to Premium" in your dashboard',
                'Choose your subscription plan (monthly or annual)',
                'Select your preferred payment method',
                'Complete the payment process',
                'Your premium features will be activated immediately',
            ],
        },
        {
            title: 'How to reset your password',
            steps: [
                'Click on "Forgot Password?" on the login page',
                'Enter your registered email address',
                'Check your email for a password reset link',
                'Click the link and enter your new password',
                'Confirm your new password',
                'Log in with your new credentials',
            ],
        },
    ];

    const premiumGuides = [
        {
            title: 'How to create a custom practice paper',
            content:
                'Log in to your premium account and navigate to "Create Custom Paper". Select the categories you want to practice (you can choose multiple). Set the number of questions for your paper. Choose difficulty level if available. Click "Generate Paper" and start your custom test. Your performance will be automatically saved.',
        },
        {
            title: 'How to select categories for your test',
            content:
                "When creating a custom paper, you'll see a list of available categories including General Knowledge, English, Mathematics, Islamiat, Pakistan Studies, Current Affairs, and more. Simply check the boxes next to the categories you want to include. You can select one category or combine multiple categories for comprehensive practice.",
        },
        {
            title: 'How to review your answers and explanations',
            content:
                'After completing a test, click "Review Answers" on the results page. You\'ll see each question with your selected answer and the correct answer. Questions you got wrong are highlighted in red, correct ones in green. Click on any question to view the detailed explanation. You can also bookmark questions for later review.',
        },
        {
            title: 'How to track your performance history',
            content:
                'Go to "My Dashboard" and click on "Performance History". You\'ll see a complete record of all papers you\'ve attempted, including scores, time taken, and accuracy percentage. View detailed analytics showing your strongest and weakest categories. Track your improvement over time with visual graphs and charts.',
        },
    ];

    const jobsInfo = [
        {
            title: 'How to find the latest government and private job ads',
            content:
                'Visit the "Jobs" section from the main menu. Browse the latest job postings updated daily. Each listing includes job title, organization, eligibility criteria, application deadline, and how to apply. Jobs are categorized by type (Government/Private) and department.',
        },
        {
            title: 'How to filter jobs by province, district, and city',
            content:
                'On the Jobs page, use the filter panel on the left side. Select your preferred province from the dropdown menu. Choose specific districts or cities within that province. Apply additional filters like job type, department, or deadline. Click "Apply Filters" to see matching job postings. You can save your filter preferences for future visits.',
        },
        {
            title: 'Important Disclaimer',
            content:
                "PAK QUIZ is an independent platform and is NOT affiliated with PPSC, FPSC, NTS, PTS, NJP, or any government organization. We only share job updates and information available publicly. For official information, please visit the respective organization's official website. We are not responsible for any changes in job advertisements, deadlines, or exam schedules.",
            isWarning: true,
        },
    ];

    const billingInfo = [
        {
            title: 'How to change your account details',
            content:
                'Log in to your account and go to "Profile Settings". Click "Edit Profile" to update your name, email, phone number, or other information. Change your password from the "Security" tab. Update your educational background and job preferences. Click "Save Changes" to update your profile. Some changes may require email verification.',
        },
        {
            title: 'How to cancel your premium subscription',
            content:
                'Log in to your account and go to "Subscription Settings". Click on "Manage Subscription". Select "Cancel Subscription" and follow the prompts. You will retain premium access until the end of your current billing period. After cancellation, you won\'t be charged again, but you\'ll still have access until your paid period ends. Your account will automatically revert to the free tier after expiration.',
        },
        {
            title: 'Refund policy for premium users',
            content:
                'All premium subscription fees are non-refundable. We do not provide refunds or credits for partial subscription periods, unused services, or if you decide to cancel your subscription. Please review the features carefully before purchasing. If you experience technical issues preventing you from using our services, contact our support team for assistance.',
            isWarning: true,
        },
    ];

    const filteredFaqs = faqs.filter(
        (faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const SectionHeader: React.FC<{ heading: string; subHeading: string; className?: string }> = ({ heading, subHeading, className }) => {
        return (
            <div className={`mb-6 ${className}`}>
                <h2 className="mb-2 text-lg font-bold md:text-2xl">{heading}</h2>
                <p className="text-muted max-sm:text-sm">{subHeading}</p>
            </div>
        );
    };

    const SectionLayout: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
        return <div className={`px-3 py-6 md:p-8 ${className}`}>{children}</div>;
    };

    const HelpCard: React.FC<{ title: string; description: string; icon: LucideIcon; email: string; className?: string; iconClass?: string }> = ({
        title,
        description,
        email,
        icon,
        className,
        iconClass,
    }) => {
        return (
            <div className={`rounded-lg border border-gray-200 p-6 transition-colors hover:border-blue-300 ${className}`}>
                <Icon iconNode={icon} className={`mb-4 h-8 w-8 ${iconClass}`} />
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="mb-3 text-muted max-sm:text-sm">{description}</p>
                <a href={`mailto:${email}`} className="font-medium text-blue-600 hover:text-blue-700">
                    {email}
                </a>
            </div>
        );
    };

    return (
        <div className="py-6 md:py-12">
            {/* Category Pills */}
            <div className="mb-4 flex flex-wrap justify-center gap-3 md:mb-8">
                {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <Button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-all max-md:text-xs ${
                                activeCategory === category.id ? 'bg-primary shadow-lg' : 'bg-secondary text-secondary-foreground hover:bg-primary/35'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {category.label}
                        </Button>
                    );
                })}
            </div>

            {/* Content Sections */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                {/* FAQs Section */}
                {activeCategory === 'faqs' && (
                    <SectionLayout>
                        <div className="mb-6">
                            <SectionHeader heading="Frequently Asked Questions" subHeading="Quick answers to common questions about PAK QUIZ" />
                            <div className="relative mx-auto mt-4 max-w-xl">
                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
                                <Input
                                    type="text"
                                    placeholder="Search for help articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg py-3 pr-4 pl-12 focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Accordion type="single" collapsible className="w-full space-y-3">
                                {filteredFaqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="border-none">
                                        <AccordionTrigger className="rounded-lg bg-secondary px-3 text-left font-semibold max-md:text-sm md:px-6">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="p-3 leading-relaxed md:p-6">{faq.answer}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </SectionLayout>
                )}

                {/* Getting Started Section */}
                {activeCategory === 'getting-started' && (
                    <SectionLayout>
                        <SectionHeader heading="Getting Started" subHeading="Step-by-step guides to help you begin your journey" />

                        <div className="space-y-6">
                            {gettingStartedGuides.map((guide, index) => (
                                <div key={index} className="rounded-lg border border-gray-200 p-6">
                                    <h3 className="mb-4 font-semibold lg:text-xl">{guide.title}</h3>
                                    <ol className="space-y-3">
                                        {guide.steps.map((step, stepIndex) => (
                                            <li key={stepIndex} className="flex items-start gap-3">
                                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                                    {stepIndex + 1}
                                                </span>
                                                <span className="pt-0.5 max-md:text-sm">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    </SectionLayout>
                )}

                {/* Premium Features Section */}
                {activeCategory === 'premium' && (
                    <SectionLayout>
                        <SectionHeader heading="Using Premium Features" subHeading="Get the most out of your premium membership" />

                        <div className="space-y-6">
                            {premiumGuides.map((guide, index) => (
                                <div key={index} className="rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 md:p-6">
                                    <h3 className="mb-3 font-semibold lg:text-xl">{guide.title}</h3>
                                    <p className="leading-relaxed max-md:text-sm">{guide.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-lg bg-info p-4">
                            <p className="text-sm text-info-foreground">
                                <strong>💡 Pro Tip:</strong> Premium features are designed to maximize your exam preparation. Use custom papers to
                                focus on weak areas and track your progress regularly to see improvement over time.
                            </p>
                        </div>
                    </SectionLayout>
                )}

                {/* Jobs & Updates Section */}
                {activeCategory === 'jobs' && (
                    <SectionLayout>
                        <SectionHeader heading="Jobs & Updates" subHeading="Stay informed about the latest job opportunities" />

                        <div className="space-y-6">
                            {jobsInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className={`rounded-lg border p-6 ${info.isWarning ? 'border-warning bg-warning' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {info.isWarning && <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning-foreground" />}
                                        <div className="flex-1">
                                            <h3
                                                className={`mb-3 text-lg font-semibold md:text-xl ${info.isWarning ? 'text-warning-foreground' : ''}`}
                                            >
                                                {info.title}
                                            </h3>
                                            <p className={`leading-relaxed max-md:text-sm ${info.isWarning && 'text-warning-foreground'}`}>
                                                {info.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-lg border border-green-200 bg-success p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-foreground" />
                                <p className="text-sm text-success-foreground">
                                    Job ads are updated daily! Enable notifications in your account settings to receive alerts about new job postings
                                    matching your preferences.
                                </p>
                            </div>
                        </div>
                    </SectionLayout>
                )}

                {/* Account & Billing Section */}
                {activeCategory === 'billing' && (
                    <SectionLayout>
                        <SectionHeader heading="Account & Billing" subHeading="Manage your account and subscription settings" />

                        <div className="space-y-6">
                            {billingInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className={`rounded-lg border p-6 ${info.isWarning ? 'border-destructive bg-destructive' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {info.isWarning && <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive-foreground" />}
                                        <div className="flex-1">
                                            <h3
                                                className={`mb-3 text-lg font-semibold md:text-xl ${info.isWarning && 'text-destructive-foreground'}`}
                                            >
                                                {info.title}
                                            </h3>
                                            <p className={`leading-relaxed max-md:text-sm ${info.isWarning && 'text-destructive-foreground'}`}>
                                                {info.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionLayout>
                )}

                {/* Contact & Support Section */}
                {activeCategory === 'support' && (
                    <SectionLayout>
                        <SectionHeader heading="Contact & Support" subHeading="Get help from our support team" />

                        <div className="grid gap-6 md:grid-cols-2">
                            <HelpCard
                                title="Email Support"
                                description="Send us an email and we'll respond within 24 hours."
                                email="support@pakquiz.com"
                                icon={Mail}
                                iconClass="text-blue-600"
                            />

                            <HelpCard
                                title="Report an Error in MCQs"
                                description="Found a mistake? Help us improve by reporting it."
                                email="feedback@pakquiz.com"
                                icon={AlertCircle}
                                iconClass="text-orange-600"
                            />

                            <HelpCard
                                title="Technical Issues"
                                description="Experiencing technical problems? Let us know."
                                email="tech@pakquiz.com"
                                icon={HelpCircle}
                                iconClass="text-purple-600"
                            />

                            <HelpCard
                                title="Business Inquiries"
                                description="Partnerships, advertising, and business opportunities."
                                email="business@pakquiz.com"
                                icon={Briefcase}
                                iconClass="text-green-600"
                            />
                        </div>

                        <div className="mt-8 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-6">
                            <h3 className="mb-3 font-semibold text-info-foreground md:text-lg">Response Time</h3>
                            <p className="leading-relaxed max-md:text-sm">
                                We typically respond to support emails within 24 hours during business days. For urgent issues, please mark your email
                                as "Urgent" in the subject line. Premium members receive priority support.
                            </p>
                        </div>
                    </SectionLayout>
                )}
            </div>
        </div>
    );
}

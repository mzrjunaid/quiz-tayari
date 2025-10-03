import PageTitle from '@/components/public-page-title';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Homepage', href: route('home') },
    { title: 'Terms of Service', href: route('terms-of-service') },
];

const termsSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service - PAK QUIZ',
    url: 'https://www.pakquiz.com/terms-of-service',
    description:
        "Read the Terms of Service for using PAK QUIZ, Pakistan's MCQs preparation platform. Understand the rules for using quizzes, practice papers, premium features, and job ads.",
    mainEntity: {
        '@type': 'Organization',
        name: 'PAK QUIZ',
        url: 'https://www.pakquiz.com',
        logo: 'https://www.pakquiz.com/logo.png',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            telephone: '0332-6071906',
            email: 'support@pakquiz.com',
            areaServed: 'PK',
            availableLanguage: ['English', 'Urdu'],
        },
    },
};

const TermsOfService: React.FC = () => {
    return (
        <>
            <Head title="Terms of Service">
                <meta
                    name="description"
                    content="The Terms of Service for PAK QUIZ define the rules and guidelines for using our MCQs preparation website, premium services, and job ads platform."
                />
                <meta
                    name="keywords"
                    content="PAK QUIZ terms of service, quiz rules, MCQs usage policy, Pakistan jobs portal terms, user agreement"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.pakquiz.com/terms-of-service" />

                {/* ✅ Structured Data */}
                <script type="application/ld+json">{JSON.stringify(termsSchema)}</script>
            </Head>
            <PublicLayout title="Terms of Service">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <PageTitle title="Terms of Service" breadcrumbs={breadcrumbs} subtitle="Last updated: October 2, 2025" />
                    <TermsOfServicePage />
                </div>
            </PublicLayout>
        </>
    );
};

export default TermsOfService;

import { AlertTriangle, Ban, CreditCard, FileText, Mail, Phone, RefreshCw, Scale, Shield, UserCheck } from 'lucide-react';
import React, { useState } from 'react';

export function TermsOfServicePage() {
    const [activeSection, setActiveSection] = useState('');

    const sections = [
        { id: 'acceptance', title: 'Acceptance of Terms', icon: FileText },
        { id: 'services', title: 'Our Services', icon: UserCheck },
        { id: 'accounts', title: 'User Accounts', icon: Shield },
        { id: 'subscription', title: 'Subscription & Payment', icon: CreditCard },
        { id: 'conduct', title: 'User Conduct', icon: Ban },
        { id: 'intellectual', title: 'Intellectual Property', icon: Scale },
        { id: 'liability', title: 'Limitation of Liability', icon: AlertTriangle },
        { id: 'termination', title: 'Termination', icon: RefreshCw },
    ];

    return (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar Navigation */}
            <nav className="lg:col-span-1">
                <div className="sticky top-22 rounded-lg bg-card p-4 shadow-sm">
                    <h2 className="mb-4 font-semibold">Quick Navigation</h2>
                    <ul className="space-y-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveSection(section.id);
                                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                                            activeSection === section.id ? 'bg-accent font-semibold' : 'text-muted hover:bg-accent'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="text-sm">{section.title}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <div className="lg:col-span-3">
                <div className="rounded-lg bg-card p-8 shadow-sm">
                    {/* Acceptance of Terms */}
                    <section id="acceptance" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">
                            Welcome to our MCQs Preparation Platform. By accessing or using our website and services, you agree to be bound by these
                            Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not
                            use our services.
                        </p>
                        <p className="mb-4 leading-relaxed">
                            These Terms constitute a legally binding agreement between you and our platform. We reserve the right to modify these
                            Terms at any time. Your continued use of the platform after changes are posted constitutes acceptance of the modified
                            Terms.
                        </p>
                        <div className="mt-4 rounded-lg border border-blue-200 bg-info p-4">
                            <p className="text-sm text-info-foreground">
                                <strong>Important:</strong> Please read these Terms carefully before using our platform. By creating an account or
                                using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                            </p>
                        </div>
                    </section>

                    {/* Our Services */}
                    <section id="services" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Our Services</h2>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Free Services</h3>
                        <p className="mb-3 leading-relaxed">We provide free access to:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Categorized MCQs bank covering various subjects</li>
                            <li>Demo practice papers with sample questions</li>
                            <li>Latest government and private sector job listings</li>
                            <li>Basic practice features</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Premium Services</h3>
                        <p className="mb-3 leading-relaxed">Premium subscription includes:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Custom paper creation with category and question selection</li>
                            <li>Progress tracking and performance history</li>
                            <li>Detailed explanations for answers</li>
                            <li>AI-generated MCQs based on keywords</li>
                            <li>Random AI-generated practice papers</li>
                            <li>Save and review attempted papers</li>
                            <li>Advanced analytics and insights</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Service Availability</h3>
                        <p className="leading-relaxed">
                            We strive to maintain continuous service availability but do not guarantee uninterrupted access. We reserve the right to
                            modify, suspend, or discontinue any aspect of our services at any time without prior notice. We are not liable for any
                            interruptions or modifications to our services.
                        </p>
                    </section>

                    {/* User Accounts */}
                    <section id="accounts" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">User Accounts & Registration</h2>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Account Creation</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>You must be at least 16 years old to create an account</li>
                            <li>You must provide accurate, current, and complete information</li>
                            <li>You are responsible for maintaining account confidentiality</li>
                            <li>You may not share your account credentials with others</li>
                            <li>One person may not maintain multiple accounts</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Account Security</h3>
                        <p className="mb-3 leading-relaxed">You are responsible for all activities that occur under your account. You must:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Choose a strong, unique password</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>Keep your contact information up to date</li>
                            <li>Log out after each session on shared devices</li>
                        </ul>
                        <p className="mt-3 leading-relaxed">
                            We are not liable for any loss or damage arising from your failure to protect your account credentials.
                        </p>
                    </section>

                    {/* Subscription & Payment */}
                    <section id="subscription" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <CreditCard className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Subscription & Payment Terms</h2>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Premium Subscription</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Premium subscriptions are available on monthly or annual basis</li>
                            <li>Prices are displayed in Pakistani Rupees (PKR)</li>
                            <li>Payment must be made through our authorized payment methods</li>
                            <li>Subscriptions auto-renew unless cancelled before renewal date</li>
                            <li>You will receive notification before each renewal</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Billing & Charges</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>All fees are non-refundable except as required by law</li>
                            <li>We reserve the right to change subscription prices with notice</li>
                            <li>Price changes do not affect current subscription period</li>
                            <li>Failed payments may result in service suspension</li>
                            <li>All applicable taxes will be added to subscription fees</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Cancellation & Refunds</h3>
                        <p className="mb-3 leading-relaxed">
                            You may cancel your premium subscription at any time through your account settings. Upon cancellation:
                        </p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>You will retain access until the end of current billing period</li>
                            <li>No refunds will be provided for partial periods</li>
                            <li>Auto-renewal will be disabled</li>
                            <li>Your account will revert to free tier after expiration</li>
                        </ul>

                        <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-warning p-4">
                            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning-foreground" />
                            <p className="text-sm text-warning-foreground">
                                <strong>No Refund Policy:</strong> All subscription fees are non-refundable. We do not provide refunds or credits for
                                partial subscription periods, unused services, or if you decide to cancel your subscription.
                            </p>
                        </div>
                    </section>

                    {/* User Conduct */}
                    <section id="conduct" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <Ban className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">User Conduct & Prohibited Activities</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">You agree not to engage in any of the following prohibited activities:</p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Content-Related Violations</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Copying, reproducing, or distributing our MCQs or content</li>
                            <li>Creating derivative works from our materials</li>
                            <li>Sharing premium content with non-subscribers</li>
                            <li>Scraping or data mining our platform</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Technical Violations</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Attempting to gain unauthorized access to our systems</li>
                            <li>Using bots, scripts, or automation tools</li>
                            <li>Reverse engineering or decompiling our platform</li>
                            <li>Bypassing security measures or access controls</li>
                            <li>Interfering with platform operation or other users' access</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Account-Related Violations</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Creating multiple accounts for the same person</li>
                            <li>Sharing account credentials with others</li>
                            <li>Impersonating others or providing false information</li>
                            <li>Using the platform for commercial purposes without authorization</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Content Submission</h3>
                        <p className="leading-relaxed">
                            If you submit any content, feedback, or suggestions to us, you grant us a perpetual, irrevocable, worldwide, royalty-free
                            license to use, modify, and incorporate such content into our services without compensation to you.
                        </p>
                    </section>

                    {/* Intellectual Property */}
                    <section id="intellectual" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <Scale className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Intellectual Property Rights</h2>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Our Content</h3>
                        <p className="mb-4 leading-relaxed">
                            All content on our platform, including but not limited to MCQs, questions, answers, explanations, practice papers, job
                            listings, text, graphics, logos, icons, images, audio clips, and software, is the property of our platform or our content
                            suppliers and is protected by Pakistani and international copyright laws.
                        </p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Limited License</h3>
                        <p className="mb-3 leading-relaxed">We grant you a limited, non-exclusive, non-transferable license to:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Access and use our platform for personal, non-commercial purposes</li>
                            <li>View and practice with MCQs and materials provided</li>
                            <li>Download content for offline personal study (premium users only)</li>
                        </ul>
                        <p className="mt-3 leading-relaxed">
                            This license does not include the right to reproduce, distribute, modify, or create derivative works from our content.
                        </p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Trademarks</h3>
                        <p className="leading-relaxed">
                            Our platform name, logo, and related marks are trademarks. You may not use these marks without our prior written
                            permission. All other trademarks appearing on our platform are the property of their respective owners.
                        </p>
                    </section>

                    {/* Disclaimer & Limitation of Liability */}
                    <section id="liability" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Disclaimer & Limitation of Liability</h2>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Service Disclaimer</h3>
                        <p className="mb-4 leading-relaxed">
                            Our platform and services are provided on an "as is" and "as available" basis without warranties of any kind, either
                            express or implied. We do not warrant that:
                        </p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>The service will be uninterrupted, timely, secure, or error-free</li>
                            <li>The results from using our service will be accurate or reliable</li>
                            <li>The quality of products, services, or information will meet expectations</li>
                            <li>Any errors in the software or content will be corrected</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Educational Content Disclaimer</h3>
                        <div className="mb-4 rounded-lg border border-red-200 bg-destructive p-4">
                            <p className="leading-relaxed text-destructive-foreground">
                                <strong>Important:</strong> While we strive to provide accurate and up-to-date MCQs and practice materials, we do not
                                guarantee the accuracy, completeness, or reliability of any content. Our platform is for practice and preparation
                                purposes only. We are not responsible for:
                            </p>
                            <ul className="mt-2 ml-4 list-inside list-disc space-y-1 text-destructive-foreground">
                                <li>Exam results or outcomes</li>
                                <li>Job application success</li>
                                <li>Accuracy of AI-generated content</li>
                                <li>Errors or omissions in MCQs or explanations</li>
                                <li>Changes in exam patterns or syllabi</li>
                            </ul>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Limitation of Liability</h3>
                        <p className="mb-3 leading-relaxed">To the maximum extent permitted by law, we shall not be liable for:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                            <li>Loss of profits, revenue, data, or use</li>
                            <li>Business interruption or loss of opportunity</li>
                            <li>Any damages arising from your use or inability to use our services</li>
                        </ul>
                        <p className="mt-3 leading-relaxed">
                            Our total liability shall not exceed the amount you paid for premium services in the 12 months preceding the claim.
                        </p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Third-Party Content</h3>
                        <p className="leading-relaxed">
                            Job listings and information about government exams are provided for informational purposes only. We do not verify the
                            accuracy of job postings and are not responsible for third-party content, websites, or services linked from our platform.
                        </p>
                    </section>

                    {/* Termination */}
                    <section id="termination" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <RefreshCw className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Account Termination & Suspension</h2>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Termination by You</h3>
                        <p className="mb-3 leading-relaxed">You may terminate your account at any time by:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Accessing account settings and selecting account deletion</li>
                            <li>Contacting our support team</li>
                        </ul>
                        <p className="mt-3 leading-relaxed">
                            Upon termination, you will lose access to all services, including saved progress and premium features. No refunds will be
                            provided for any remaining subscription period.
                        </p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Termination by Us</h3>
                        <p className="mb-3 leading-relaxed">
                            We reserve the right to suspend or terminate your account immediately, without prior notice, if:
                        </p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>You violate these Terms of Service</li>
                            <li>You engage in fraudulent or illegal activities</li>
                            <li>Your payment method fails or is disputed</li>
                            <li>We suspect unauthorized access or security breaches</li>
                            <li>We are required to do so by law</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Effects of Termination</h3>
                        <p className="leading-relaxed">
                            Upon termination of your account, all licenses granted to you will immediately cease, and you must discontinue all use of
                            our services. We may retain your information as required by law or for legitimate business purposes. Sections of these
                            Terms that by their nature should survive termination shall survive, including intellectual property provisions,
                            disclaimers, and limitations of liability.
                        </p>
                    </section>

                    {/* Dispute Resolution */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Dispute Resolution & Governing Law</h2>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Governing Law</h3>
                        <p className="mb-4 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of
                            law provisions.
                        </p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Dispute Resolution</h3>
                        <p className="mb-3 leading-relaxed">In the event of any dispute arising from these Terms or your use of our services:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>You agree to first attempt to resolve the dispute informally by contacting us</li>
                            <li>
                                If informal resolution fails, disputes shall be subject to the exclusive jurisdiction of courts in Lahore, Pakistan
                            </li>
                            <li>Both parties agree to waive any right to a jury trial</li>
                        </ul>
                    </section>

                    {/* Indemnification */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Indemnification</h2>
                        <p className="leading-relaxed">
                            You agree to indemnify, defend, and hold harmless our platform, its officers, directors, employees, and agents from and
                            against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to
                            or use of our services, your violation of these Terms, or your violation of any rights of another party.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Changes to Terms</h2>
                        <p className="mb-4 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of material changes by:
                        </p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Posting the updated Terms on our platform</li>
                            <li>Sending email notification to registered users</li>
                            <li>Displaying a prominent notice on our website</li>
                        </ul>
                        <p className="mt-4 leading-relaxed">
                            Your continued use of our services after such modifications constitutes acceptance of the updated Terms. If you do not
                            agree to the modified Terms, you must stop using our services.
                        </p>
                    </section>

                    {/* Severability */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Severability</h2>
                        <p className="leading-relaxed">
                            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to
                            the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
                        </p>
                    </section>

                    {/* Entire Agreement */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Entire Agreement</h2>
                        <p className="leading-relaxed">
                            These Terms, together with our Privacy Policy and any other legal notices published by us on our platform, constitute the
                            entire agreement between you and us concerning your use of our services and supersede all prior agreements and
                            understandings.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
                        <p className="mb-4 leading-relaxed">If you have any questions about these Terms, please contact us:</p>
                        <div className="rounded-lg bg-info p-6">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                                    <div className="text-info-foreground">
                                        <span className="font-semibold">Email:</span>{' '}
                                        <a href={`mailto:${termsSchema.mainEntity.contactPoint.email}`} className="hover:underline">
                                            {termsSchema.mainEntity.contactPoint.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                                    <div>
                                        <p>
                                            <span className="font-semibold">Whatsapp:</span>{' '}
                                            <a href={`tel:${termsSchema.mainEntity.contactPoint.email}`} className="hover:underline">
                                                {termsSchema.mainEntity.contactPoint.telephone}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Acknowledgment */}
                    <div className="border-t border-muted/65 pt-8">
                        <div className="rounded-lg bg-gray-50 p-6">
                            <p className="mb-2 text-sm font-semibold text-foreground">
                                By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of
                                Service.
                            </p>
                            <p className="text-sm text-muted">Last updated: October 2, 2025</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

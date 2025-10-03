import { AlertCircle, Database, Eye, FileText, Lock, Mail, Phone, Shield, UserCheck } from 'lucide-react';
import { useState } from 'react';

import PageTitle from '@/components/public-page-title';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Homepage', href: route('home') },
    { title: 'Privacy Policy', href: route('privacy-policy') },
];

const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - PAK QUIZ',
    url: 'https://www.pakquiz.com/privacy-policy',
    description:
        'Read the PAK QUIZ Privacy Policy to learn how we collect, use, and protect your personal information while using our MCQs preparation platform and job updates service.',
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

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <Head title="Privacy Policy">
                <meta
                    name="description"
                    content="PAK QUIZ Privacy Policy explains how your personal data is collected, stored, and used when accessing MCQs, practice papers, premium membership, and job ads."
                />
                <meta
                    name="keywords"
                    content="PAK QUIZ privacy policy, data protection, user information, MCQs app policy, Pakistan jobs portal policy"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.pakquiz.com/privacy-policy" />

                {/* ✅ Structured Data */}
                <script type="application/ld+json">{JSON.stringify(privacySchema)}</script>
            </Head>
            <PublicLayout title="Privacy Policy">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <PageTitle title="Privacy Policy" breadcrumbs={breadcrumbs} subtitle="Last updated: October 2, 2025" />
                    <PrivacyPolicyPage />
                </div>
            </PublicLayout>
        </>
    );
};

export default PrivacyPolicy;

export function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('');

    const sections = [
        { id: 'introduction', title: 'Introduction', icon: Shield },
        { id: 'information', title: 'Information We Collect', icon: Database },
        { id: 'usage', title: 'How We Use Your Information', icon: Eye },
        { id: 'protection', title: 'Data Protection', icon: Lock },
        { id: 'cookies', title: 'Cookies & Tracking', icon: FileText },
        { id: 'rights', title: 'Your Rights', icon: UserCheck },
        { id: 'contact', title: 'Contact Us', icon: Mail },
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
                <div className="rounded-lg border border-gray-200 bg-card p-8 shadow-sm">
                    {/* Introduction */}
                    <section id="introduction" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Introduction</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">
                            Welcome to our MCQs Preparation Platform. We are committed to protecting your privacy and ensuring the security of your
                            personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                            use our website and services.
                        </p>
                        <p className="leading-relaxed">
                            By accessing or using our platform, you agree to the terms outlined in this Privacy Policy. If you do not agree with our
                            practices, please do not use our services.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section id="information" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <Database className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Information We Collect</h2>
                        </div>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Personal Information</h3>
                        <p className="mb-3 leading-relaxed">When you register for an account or use our premium services, we may collect:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Name and contact information (email address, phone number)</li>
                            <li>Account credentials (username, password)</li>
                            <li>Payment information for premium subscriptions</li>
                            <li>Educational background and job preferences</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Usage Information</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Practice test results and performance metrics</li>
                            <li>Questions attempted and time spent on platform</li>
                            <li>Custom paper preferences and categories selected</li>
                            <li>Progress tracking data and learning patterns</li>
                        </ul>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Technical Information</h3>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>IP address and device information</li>
                            <li>Browser type and operating system</li>
                            <li>Pages visited and features used</li>
                            <li>Date and time of access</li>
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section id="usage" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <Eye className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">We use the collected information for the following purposes:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>To provide and maintain our MCQs preparation services</li>
                            <li>To process premium subscription payments and manage accounts</li>
                            <li>To track your progress and generate performance analytics</li>
                            <li>To generate AI-powered practice papers based on your preferences</li>
                            <li>To send notifications about new job postings and practice materials</li>
                            <li>To improve our platform and develop new features</li>
                            <li>To provide customer support and respond to inquiries</li>
                            <li>To prevent fraud and ensure platform security</li>
                            <li>To comply with legal obligations and regulatory requirements</li>
                        </ul>
                    </section>

                    {/* Data Protection */}
                    <section id="protection" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <Lock className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Data Protection & Security</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect your personal information:
                        </p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>SSL encryption for data transmission</li>
                            <li>Secure password hashing and storage</li>
                            <li>Regular security audits and updates</li>
                            <li>Restricted access to personal data by authorized personnel only</li>
                            <li>Secure payment processing through trusted payment gateways</li>
                            <li>Regular backups to prevent data loss</li>
                        </ul>
                        <div className="mt-4 flex gap-3 rounded-lg bg-warning p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                            <p className="text-sm text-warning-foreground">
                                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot
                                guarantee absolute security of your data.
                            </p>
                        </div>
                    </section>

                    {/* Cookies & Tracking */}
                    <section id="cookies" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Cookies & Tracking Technologies</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">We use cookies and similar tracking technologies to enhance your experience:</p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Essential Cookies</h3>
                        <p className="mb-3 leading-relaxed">
                            Required for basic platform functionality, including authentication and session management.
                        </p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Analytics Cookies</h3>
                        <p className="mb-3 leading-relaxed">Help us understand how users interact with our platform to improve services.</p>

                        <h3 className="mt-6 mb-3 text-lg font-semibold">Preference Cookies</h3>
                        <p className="mb-3 leading-relaxed">Remember your settings and preferences for a personalized experience.</p>

                        <p className="mt-4 leading-relaxed">
                            You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect platform
                            functionality.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section id="rights" className="mb-12">
                        <div className="mb-4 flex items-center gap-2">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Your Rights</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">You have the following rights regarding your personal information:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>
                                <strong>Access:</strong> Request a copy of your personal data we hold
                            </li>
                            <li>
                                <strong>Correction:</strong> Update or correct inaccurate information
                            </li>
                            <li>
                                <strong>Deletion:</strong> Request deletion of your account and associated data
                            </li>
                            <li>
                                <strong>Data Portability:</strong> Receive your data in a structured format
                            </li>
                            <li>
                                <strong>Opt-out:</strong> Unsubscribe from marketing communications
                            </li>
                            <li>
                                <strong>Restriction:</strong> Request limitation on processing of your data
                            </li>
                        </ul>
                        <p className="mt-4 leading-relaxed">To exercise these rights, please contact us using the information provided below.</p>
                    </section>

                    {/* Third-Party Services */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Third-Party Services</h2>
                        <p className="mb-4 leading-relaxed">We may use third-party services for:</p>
                        <ul className="ml-4 list-inside list-disc space-y-2">
                            <li>Payment processing (payment gateways)</li>
                            <li>Analytics and performance monitoring</li>
                            <li>AI-powered MCQ generation</li>
                            <li>Email delivery and notifications</li>
                        </ul>
                        <p className="mt-4 leading-relaxed">
                            These third parties have their own privacy policies and we encourage you to review them. We are not responsible for their
                            practices.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Data Retention</h2>
                        <p className="leading-relaxed">
                            We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
                            When you delete your account, we will remove your personal data within 30 days, except where retention is required by law.
                            Practice history and performance data may be anonymized and retained for analytical purposes.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Children's Privacy</h2>
                        <p className="leading-relaxed">
                            Our services are intended for individuals aged 16 and above. We do not knowingly collect personal information from
                            children under 16. If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </section>

                    {/* Changes to Privacy Policy */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-bold">Changes to This Privacy Policy</h2>
                        <p className="leading-relaxed">
                            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify
                            you of significant changes via email or through a prominent notice on our platform. Your continued use of our services
                            after such modifications constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact Us */}
                    <section id="contact" className="mb-8">
                        <div className="mb-4 flex items-center gap-2">
                            <Mail className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Contact Us</h2>
                        </div>
                        <p className="mb-4 leading-relaxed">
                            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="rounded-lg bg-info p-6">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                                    <div className="text-info-foreground">
                                        <span className="font-semibold">Email:</span>{' '}
                                        <a href={`mailto:${privacySchema.mainEntity.contactPoint.email}`} className="hover:underline">
                                            {privacySchema.mainEntity.contactPoint.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                                    <div>
                                        <p>
                                            <span className="font-semibold">Whatsapp:</span>{' '}
                                            <a href={`tel:${privacySchema.mainEntity.contactPoint.telephone}`} className="hover:underline">
                                                {privacySchema.mainEntity.contactPoint.telephone}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div className="border-t border-gray-200 pt-8">
                        <p className="text-center text-sm text-muted">
                            This Privacy Policy is governed by the laws of Pakistan. By using our platform, you consent to the collection and use of
                            information as described in this policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

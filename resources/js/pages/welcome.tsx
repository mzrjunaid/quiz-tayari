// import AppLayout from '@/layouts/app-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { LinkPaginatedData, Mcqs } from '@/types';
import { Head } from '@inertiajs/react';
import MCQHomepage from './Public/Homepage';

interface Props {
    mcqs: LinkPaginatedData<Mcqs>;
}

export default function Welcome({ mcqs }: Props) {
    const homepageSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': 'https://www.pakquiz.com/#website',
                url: 'https://www.pakquiz.com',
                name: 'PAK QUIZ',
                description:
                    'PAK QUIZ is Pakistan’s leading MCQs preparation website. Practice government and private job tests, PPSC, FPSC, NTS, and entry test quizzes online.',
                publisher: {
                    '@id': 'https://www.pakquiz.com/#organization',
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://www.pakquiz.com/search?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                },
            },
            {
                '@type': 'Organization',
                '@id': 'https://www.pakquiz.com/#organization',
                name: 'PAK QUIZ',
                url: 'https://www.pakquiz.com',
                logo: 'https://www.pakquiz.com/logo.png',
                sameAs: [
                    'https://www.facebook.com/pakquiz',
                    'https://www.youtube.com/@pakquiz',
                    'https://www.tiktok.com/@pakquiz',
                    'https://twitter.com/pakquiz',
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'Customer Support',
                    email: 'support@pakquiz.com',
                    areaServed: 'PK',
                    availableLanguage: ['English', 'Urdu'],
                },
            },
            {
                '@type': 'WebPage',
                '@id': 'https://www.pakquiz.com/#webpage',
                url: 'https://www.pakquiz.com',
                name: 'PAK QUIZ - Pakistan’s #1 MCQs Preparation Platform',
                description:
                    'Prepare for government and private job tests with free MCQs, past papers, and online quizzes. Practice PPSC, FPSC, NTS, and entry test questions daily on PAK QUIZ.',
                inLanguage: 'en',
                isPartOf: { '@id': 'https://www.pakquiz.com/#website' },
                about: {
                    '@type': 'EducationalOrganization',
                    name: 'PAK QUIZ',
                    sameAs: 'https://www.pakquiz.com',
                },
            },
        ],
    };

    return (
        <>
            <Head title="Pakistan’s #1 MCQs Preparation Website">
                <meta
                    name="description"
                    content="Prepare for government and private job tests with PAK QUIZ. Access free MCQs, past papers, PPSC, FPSC, NTS, and entry test quizzes updated daily."
                />
                <meta name="keywords" content="Pakistan MCQs, PPSC jobs test, FPSC, NTS, online quiz, test preparation, government jobs, PAK QUIZ" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.pakquiz.com" />

                {/* ✅ Open Graph (for sharing) */}
                <meta property="og:title" content="PAK QUIZ - Pakistan’s #1 MCQs Preparation Website" />
                <meta
                    property="og:description"
                    content="Prepare for government and private job tests with free MCQs and past papers. Updated daily."
                />
                <meta property="og:image" content="https://www.pakquiz.com/logo.png" />
                <meta property="og:url" content="https://www.pakquiz.com" />
                <meta property="og:type" content="website" />

                {/* ✅ Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="PAK QUIZ - Pakistan’s #1 MCQs Preparation Website" />
                <meta
                    name="twitter:description"
                    content="Free MCQs, past papers, and job test quizzes. Prepare for government and private exams in Pakistan."
                />
                <meta name="twitter:image" content="https://www.pakquiz.com/logo.png" />

                {/* ✅ Structured Data */}
                <script type="application/ld+json">{JSON.stringify(homepageSchema)}</script>
            </Head>
            <PublicLayout>
                <MCQHomepage mcqs={mcqs} />
            </PublicLayout>
        </>
    );
}

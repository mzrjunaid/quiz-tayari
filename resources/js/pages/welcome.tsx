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
                {/* ✅ Structured Data */}
                <script type="application/ld+json">{JSON.stringify(homepageSchema)}</script>
            </Head>
            <PublicLayout>
                <MCQHomepage mcqs={mcqs} />
            </PublicLayout>
        </>
    );
}

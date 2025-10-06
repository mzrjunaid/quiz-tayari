import McqCard from '@/components/mcqComponents/SingleMcq';
import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import SearchInput from '@/components/search-input';
import { SitePagination } from '@/components/site-pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, Mcqs, PaginationLinks, PaginationMeta, Paper } from '@/types';
import { Head } from '@inertiajs/react';
import { truncate } from 'lodash';
import TopAdSection from './Components/TopAdSection';

interface Props {
    paper: Paper;
    mcqs: {
        data: Array<Mcqs>;
        meta: PaginationMeta;
        links: PaginationLinks;
    };
}

const PaperMcqsPage: React.FC<Props> = ({ paper, mcqs }) => {
    const { data, meta, links } = mcqs;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Homepage', href: route('home') },
        { title: 'Papers List', href: route('public.papers.list') },
        {
            title: truncate(paper.title, {
                length: 30,
            }),
            href: route('public.papers.show', paper.slug),
        },
    ];
    const adSlot = false;
    const isMobile = useIsMobile();

    const baseUrl = `https://www.pakquiz.com/papers/${paper.slug}`;

    // ✅ Dynamic SEO
    const pageTitle = meta.current_page > 1 ? `${paper.title} - MCQs (Page ${meta.current_page})` : `${paper.title} - MCQs`;

    const pageDescription =
        meta.current_page > 1
            ? `Solve ${paper.title} MCQs - Page ${meta.current_page}. Includes ${paper.department} related questions with answers, explanations, and practice quizzes.`
            : `Solve ${paper.title} MCQs. Includes ${paper.department} related questions with answers, explanations, and practice quizzes.`;

    const canonicalUrl = meta.current_page > 1 ? `${baseUrl}?page=${meta.current_page}` : baseUrl;

    // ✅ JSON-LD QAPage Schema
    const qaSchema = {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: mcqs.data.map((mcq, index) => ({
            '@type': 'Question',
            name: mcq.question,
            text: mcq.question,
            upvoteCount: 0,
            answerCount: mcq.correct_answers?.length,
            acceptedAnswer: {
                '@type': 'Answer',
                text: mcq.correct_answers?.join(', '),
                upvoteCount: 0,
                url: `${baseUrl}/${mcq.slug}`,
            },
            ...(mcq.explanation
                ? {
                      suggestedAnswer: {
                          '@type': 'Answer',
                          text: mcq.explanation,
                      },
                  }
                : {}),
            about: [
                { '@type': 'Thing', name: mcq.subject },
                { '@type': 'Thing', name: paper.department },
                ...mcq.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
            ],
            position: index + 1,
        })),
    };
    return (
        <>
            <Head title={pageTitle}>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={`${paper.title} MCQs, ${paper.department} MCQs, ${paper.title} quiz, exam preparation, PAK QUIZ`} />
                <meta name="robots" content="index, follow" />

                {/* Canonical + Pagination */}
                <link rel="canonical" href={canonicalUrl} />
                {mcqs.links.prev && <link rel="prev" href={mcqs.links.prev} />}
                {mcqs.links.next && <link rel="next" href={mcqs.links.next} />}

                {/* ✅ JSON-LD */}
                <script type="application/ld+json">{JSON.stringify(qaSchema)}</script>
            </Head>
            <PublicLayout>
                {adSlot && <TopAdSection />}
                <MainSectionWithSidebarLayout>
                    <div className={`space-y-4 lg:col-span-2`}>
                        <PageTitle title={paper.title} breadcrumbs={breadcrumbs} />
                        {isMobile && <SearchInput />}
                        <div className="grid gap-4 sm:grid-cols-1">
                            {data.map((mcq, index) => {
                                return <McqCard mcq={mcq} key={index} />;
                            })}
                        </div>
                        <SitePagination meta={meta} links={links} />
                    </div>

                    <PageSidebar stat={false}>{!isMobile && <SearchInput query={'test'} />}</PageSidebar>
                </MainSectionWithSidebarLayout>
            </PublicLayout>
        </>
    );
};

export default PaperMcqsPage;

import McqCard from '@/components/mcqComponents/SingleMcq';
import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import SearchInput from '@/components/search-input';
import { SitePagination } from '@/components/site-pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, Mcqs, OldPaper, PaginationLinks, PaginationMeta } from '@/types';
import { Head } from '@inertiajs/react';
import { truncate } from 'lodash';
import TopAdSection from '../Components/TopAdSection';

interface Props {
    paper: {
        data: OldPaper;
    };
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
        { title: 'Papers List', href: route('public.old-papers.index') },
        {
            title: truncate(paper.data.paper, {
                length: 30,
            }),
            href: route('public.old-papers.show', paper.data.slug),
        },
    ];
    const adSlot = false;
    const isMobile = useIsMobile();

    const baseUrl = `https://www.pakquiz.com/old-papers/${paper.data.slug}`;

    // ✅ Dynamic SEO
    const pageTitle = meta.current_page > 1 ? `${paper.data.paper} - MCQs (Page ${meta.current_page})` : `${paper.data.paper} - MCQs`;

    const pageDescription =
        meta.current_page > 1
            ? `Solve ${paper.data.paper} MCQs - Page ${meta.current_page}. Includes ${paper.data.department.department} related questions with answers, explanations, and practice quizzes.`
            : `Solve ${paper.data.paper} MCQs. Includes ${paper.data.department.department} related questions with answers, explanations, and practice quizzes.`;

    const canonicalUrl = meta.current_page > 1 ? `${baseUrl}?page=${meta.current_page}` : baseUrl;

    // ✅ JSON-LD QAPage Schema
    // const qaSchema = {
    //     '@context': 'https://schema.org',
    //     '@type': 'QAPage',
    //     mainEntity: mcqs.data.map((mcq, index) => ({
    //         '@type': 'Question',
    //         name: mcq.question,
    //         text: mcq.question,
    //         upvoteCount: 0,
    //         answerCount: mcq.correct_answers?.length,
    //         acceptedAnswer: {
    //             '@type': 'Answer',
    //             text: mcq.correct_answers && mcq.correct_answers?.length > 1 ? mcq.correct_answers?.join(', ') : mcq.correct_answer,
    //             upvoteCount: 0,
    //             url: `${baseUrl}/${mcq.slug}`,
    //         },
    //         ...(mcq.explanation
    //             ? {
    //                   suggestedAnswer: {
    //                       '@type': 'Answer',
    //                       text: mcq.explanation,
    //                   },
    //               }
    //             : {}),
    //         about: [
    //             { '@type': 'Thing', name: mcq.subject },
    //             { '@type': 'Thing', name: paper.department },
    //             ...mcq.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
    //         ],
    //         position: index + 1,
    //     })),
    // };
    return (
        <>
            <Head title={pageTitle}>
                <meta name="description" content={pageDescription} />
                <meta
                    name="keywords"
                    content={`${paper.data.paper} MCQs, ${paper.data.department.department} MCQs, ${paper.data.paper} quiz, exam preparation, PAK QUIZ`}
                />
                <meta name="robots" content="index, follow" />

                {/* Canonical + Pagination */}
                <link rel="canonical" href={canonicalUrl} />
                {mcqs.links.prev && <link rel="prev" href={mcqs.links.prev} />}
                {mcqs.links.next && <link rel="next" href={mcqs.links.next} />}

                {/* ✅ JSON-LD */}
                {/* <script type="application/ld+json">{JSON.stringify(qaSchema)}</script> */}
            </Head>
            <PublicLayout>
                {adSlot && <TopAdSection />}
                <MainSectionWithSidebarLayout>
                    <div className={`space-y-4 lg:col-span-2`}>
                        <PageTitle title={paper.data.paper} breadcrumbs={breadcrumbs} />
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

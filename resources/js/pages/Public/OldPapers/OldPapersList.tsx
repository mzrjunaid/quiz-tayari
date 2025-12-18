import { OldPaperCard } from '@/components/mcqComponents/paper-card';
import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import SearchInput, { SearchBar } from '@/components/search-input';
import { useIsMobile } from '@/hooks/use-mobile';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, PaginationLinks } from '@/types';
import { Head } from '@inertiajs/react';
import TopAdSection from '../Components/TopAdSection';

interface Props {
    // Define any props if needed
    oldpapers: {
        data: Array<{
            paper_id: number;
            paper_year: string;
            slug: string;
            paper: string;
        }>;
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        from: number;
        to: number;
        links: PaginationLinks;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Homepage', href: route('home') },
    { title: 'Papers List', href: route('public.papers.index') },
];

const PapersList: React.FC<Props> = ({ oldpapers }) => {
    const { data, links, current_page } = oldpapers;
    const isMobile = useIsMobile();
    const adSlot = false;

    // Base URL of your site
    const baseUrl = 'https://www.pakquiz.com/papers';

    // Dynamic SEO Title & Description
    const pageTitle = current_page > 1 ? `Practice Papers - Page ${current_page}` : 'Practice Papers';

    const pageDescription =
        current_page > 1
            ? `Browse practice MCQs papers (Page ${current_page}) on PAK QUIZ. Prepare for competitive exams with solved and unsolved quizzes.`
            : 'Browse practice MCQs papers on PAK QUIZ. Prepare for competitive exams with solved and unsolved quizzes.';

    // ✅ Dynamic canonical URL
    const canonicalUrl = current_page > 1 ? `${baseUrl}?page=${current_page}` : baseUrl;

    // ✅ JSON-LD ItemList Schema
    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Practice Papers - PAK QUIZ',
        description:
            'List of MCQs practice papers for exam preparation in Pakistan, including general knowledge, current affairs, and job test quizzes.',
        url: canonicalUrl,
        numberOfItems: data.length,
        itemListElement: data.map((paper, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${baseUrl}/${paper.slug}`,
            name: paper,
            description: paper,
        })),
    };

    // const scrollRef = useRef<HTMLDivElement | null>(null);
    return (
        <>
            <Head title={pageTitle}>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="MCQs papers, practice quizzes, exam preparation, Pakistan jobs papers, PAK QUIZ" />
                <meta name="robots" content="index, follow" />

                {/* Canonical */}
                <link rel="canonical" href={canonicalUrl} />

                {/* Pagination SEO signals */}
                {links.prev && <link rel="prev" href={links.prev} />}
                {links.next && <link rel="next" href={links.next} />}

                {/* JSON-LD Schema */}
                <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
            </Head>
            <PublicLayout>
                {adSlot && <TopAdSection />}
                <MainSectionWithSidebarLayout>
                    <div className={`space-y-4 lg:col-span-2`}>
                        <PageTitle title="Past Papers" breadcrumbs={breadcrumbs} />
                        {isMobile && <SearchInput />}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {data.map((paper, index) => {
                                return <OldPaperCard paper={paper} key={index} />;
                            })}
                        </div>
                        {/* <SitePagination meta={meta} links={links} /> */}
                    </div>

                    <PageSidebar stat={false}>{!isMobile && <SearchBar />}</PageSidebar>
                </MainSectionWithSidebarLayout>
            </PublicLayout>
        </>
    );
};

export default PapersList;

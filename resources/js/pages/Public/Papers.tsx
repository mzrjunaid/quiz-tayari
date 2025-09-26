import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import { SitePagination } from '@/components/site-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, PaginationLinks, PaginationMeta, Paper } from '@/types';
import { Link } from '@inertiajs/react';
import TopAdSection from './Components/TopAdSection';

interface Props {
    // Define any props if needed
    papers: {
        data: Array<Paper>;
        meta: PaginationMeta;
        links: PaginationLinks;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Homepage', href: route('home') },
    { title: 'Papers List', href: route('public-papers.list') },
];

const PapersList: React.FC<Props> = ({ papers }) => {
    const { data, meta, links } = papers;
    const adSlot = false;

    // const scrollRef = useRef<HTMLDivElement | null>(null);
    return (
        <PublicLayout title="Past Papers">
            {adSlot && <TopAdSection />}
            <MainSectionWithSidebarLayout>
                <div className={`space-y-4 lg:col-span-2`}>
                    <PageTitle title="Past Papers" breadcrumbs={breadcrumbs} />
                    <div className="flex flex-wrap gap-2">
                        {data.map((paper, index) => {
                            return (
                                <div className="max-w-96 space-y-2 rounded-sm bg-card px-2 py-3" key={index}>
                                    <div className="flex flex-row justify-between">
                                        <Badge>{paper.department}</Badge>
                                        <Badge variant="secondary">{paper.testing_service.short}</Badge>
                                    </div>
                                    <Button variant="link" asChild className="p-0">
                                        <Link href={route('public-papers.show', paper.slug)}>{paper.title}</Link>
                                    </Button>
                                    <div className="flex flex-row justify-between">
                                        {paper.scheduled_at && paper.scheduled_at.date_only}
                                        <Badge variant="outline">{paper.subject}</Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <SitePagination meta={meta} links={links} />
                    <pre>{JSON.stringify(papers, null, 2)}</pre>
                </div>

                <PageSidebar stat={false} />
            </MainSectionWithSidebarLayout>
        </PublicLayout>
    );
};

export default PapersList;

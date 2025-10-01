import McqCard from '@/components/mcqComponents/SingleMcq';
import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import SearchInput from '@/components/search-input';
import { SitePagination } from '@/components/site-pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, Mcqs, PaginationLinks, PaginationMeta, Paper } from '@/types';
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
        { title: 'Papers List', href: route('public-papers.list') },
        {
            title: truncate(paper.title, {
                length: 30,
            }),
            href: route('public-papers.show', paper.slug),
        },
    ];
    const adSlot = false;
    const isMobile = useIsMobile();
    return (
        <PublicLayout title={paper.title}>
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
    );
};

export default PaperMcqsPage;

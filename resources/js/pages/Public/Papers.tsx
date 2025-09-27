import PaperCard from '@/components/mcqComponents/paper-card';
import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import SearchInput from '@/components/search-input';
import { SitePagination } from '@/components/site-pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, PaginationLinks, PaginationMeta, Paper } from '@/types';
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
    const isMobile = useIsMobile();
    const adSlot = false;

    // const scrollRef = useRef<HTMLDivElement | null>(null);
    return (
        <PublicLayout title="Past Papers">
            {adSlot && <TopAdSection />}
            <MainSectionWithSidebarLayout>
                <div className={`space-y-4 lg:col-span-2`}>
                    <PageTitle title="Past Papers" breadcrumbs={breadcrumbs} />
                    {isMobile && <SearchInput />}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {data.map((paper, index) => {
                            return <PaperCard paper={paper} key={index} />;
                        })}
                    </div>
                    <SitePagination meta={meta} links={links} />
                </div>

                <PageSidebar stat={false}>{!isMobile && <SearchInput query={'test'} />}</PageSidebar>
            </MainSectionWithSidebarLayout>
        </PublicLayout>
    );
};

export default PapersList;

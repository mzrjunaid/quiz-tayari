import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import SearchInput from '@/components/search-input';
import { useIsMobile } from '@/hooks/use-mobile';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, OldMcqs } from '@/types';
import { Head } from '@inertiajs/react';
import { truncate } from 'lodash';
import OldMcqCard from './OldSingleMcq';

interface Props {
    mcq: {
        data: OldMcqs;
    };
}

const OldMcqShow: React.FC<Props> = ({ mcq }) => {
    // console.log('OldMcqShow mcq:', mcq);
    const breadcrumbs: BreadcrumbItem[] = mcq.data.paper
        ? [
              { title: 'Homepage', href: route('home') },
              { title: 'Papers List', href: route('public.old-papers.index') },
              {
                  title: truncate(mcq.data.question, {
                      length: 30,
                  }),
                  href: route('public.old-papers.index'),
              },
          ]
        : [
              { title: 'Homepage', href: route('home') },
              {
                  title: truncate(mcq.data.question, {
                      length: 30,
                  }),
                  href: route('public.mcqs.show', mcq.data.slug),
              },
          ];

    const isMobile = useIsMobile();
    return (
        <>
            <Head title={mcq.data.question}></Head>
            <PublicLayout>
                <MainSectionWithSidebarLayout>
                    <div className={`space-y-4 lg:col-span-2`}>
                        <PageTitle title={mcq.data.paper ? mcq.data.paper?.title : ''} breadcrumbs={breadcrumbs} />
                        <OldMcqCard mcq={mcq.data} />
                    </div>
                    <PageSidebar stat={false}>{!isMobile && <SearchInput query={'test'} />}</PageSidebar>
                </MainSectionWithSidebarLayout>
            </PublicLayout>
        </>
    );
};

export default OldMcqShow;

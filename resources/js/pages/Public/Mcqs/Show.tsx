import McqCard from '@/components/mcqComponents/SingleMcq';
import PageSidebar from '@/components/page-sidebar';
import PageTitle from '@/components/public-page-title';
import SearchInput from '@/components/search-input';
import { useIsMobile } from '@/hooks/use-mobile';
import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, Mcqs } from '@/types';
import { Head } from '@inertiajs/react';
import { truncate } from 'lodash';

interface Props {
    mcq: Mcqs;
}

const Show: React.FC<Props> = ({ mcq }) => {
    const breadcrumbs: BreadcrumbItem[] = mcq.paper
        ? [
              { title: 'Homepage', href: route('home') },
              { title: 'Papers List', href: route('public.papers.index') },
              {
                  title: truncate(mcq.paper?.title, {
                      length: 30,
                  }),
                  href: route('public.papers.show', mcq.paper?.slug),
              },
              {
                  title: truncate(mcq.question, {
                      length: 30,
                  }),
                  href: route('public.papers.mcqs.show', { paper: mcq.paper?.slug, mcq: mcq.slug }),
              },
          ]
        : [
              { title: 'Homepage', href: route('home') },
              {
                  title: truncate(mcq.question, {
                      length: 30,
                  }),
                  href: route('public.mcqs.show', mcq.slug),
              },
          ];

    const isMobile = useIsMobile();
    return (
        <>
            <Head title={mcq.question}></Head>
            <PublicLayout>
                <MainSectionWithSidebarLayout>
                    <div className={`space-y-4 lg:col-span-2`}>
                        <PageTitle title={mcq.paper ? mcq.paper?.title : ''} breadcrumbs={breadcrumbs} />
                        <McqCard mcq={mcq} />
                    </div>
                    <PageSidebar stat={false}>{!isMobile && <SearchInput query={'test'} />}</PageSidebar>
                </MainSectionWithSidebarLayout>
            </PublicLayout>
        </>
    );
};

export default Show;

import MainSectionWithSidebarLayout from '@/layouts/frontend/main-section-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { BreadcrumbItem, Paper } from '@/types';
import HeroSectionHeading from './Components/HeroSectionHeading';

interface Props {
    // Define any props if needed
    papers?: Array<Paper>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Homepage', href: route('home') },
    { title: 'Papers List', href: route('public-papers.list') },
];

const PapersList: React.FC<Props> = () => {
    return (
        <PublicLayout title="Past Papers">
            <HeroSectionHeading title="Past Papers" breadcrumbs={breadcrumbs} />
            <MainSectionWithSidebarLayout sidebarChildren={<div>testing sidebar</div>}>
                <div>Testing</div>
            </MainSectionWithSidebarLayout>
        </PublicLayout>
    );
};

export default PapersList;

import { BreadcrumbItem } from '@/types';
import { Breadcrumbs } from './breadcrumbs';

interface Props {
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
}

const PageTitle: React.FC<Props> = ({ title, subtitle, breadcrumbs }) => {
    return (
        <div className="order-1 flex-1 lg:order-1">
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
            <div className="space-y-6">
                <div className="space-y-0">
                    <h1 className="text-2xl leading-tight font-bold lg:text-3xl xl:text-4xl">{title}</h1>
                    {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

export default PageTitle;

import PageSidebar from '@/components/page-sidebar';
import { features, mostRepeatingMCQs, stats } from '@/constants/features';
import { useRef } from 'react';

interface Props {
    children: React.ReactNode;
    sidebarChildren: React.ReactNode;
}

const MainSectionWithSidebarLayout: React.FC<Props> = ({ children, sidebarChildren }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    return (
        <section className="border-y px-4 py-6 md:py-16" ref={scrollRef}>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2">{children}</div>
                    {/* Sidebar */}
                    <PageSidebar features={features} mostRepeatingMCQs={mostRepeatingMCQs} stats={stats}>
                        {sidebarChildren}
                    </PageSidebar>
                </div>
            </div>
        </section>
    );
};

export default MainSectionWithSidebarLayout;

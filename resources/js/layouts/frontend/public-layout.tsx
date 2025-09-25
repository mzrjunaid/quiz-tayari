// import { BreadcrumbItem } from '@/types';
import AppMode from '@/components/app-mode';
import CallToAction from '@/components/call-to-action';
import PublicFooter from '@/components/public-footer';
import { PublicSidebar } from '@/components/public-sidebar';
import PublicHeader from '@/components/site-header';

// import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useMcqMode } from '@/hooks/use-mcq-mode';
import { useIsMobile } from '@/hooks/use-mobile';
import { Head } from '@inertiajs/react';

interface Props {
    children: React.ReactNode;
    title: string;
}

export function PublicLayout({ children, title }: Props) {
    const { mcqMode, setMcqMode } = useMcqMode();
    const isMobile = useIsMobile();
    return (
        <>
            <Head title={title} />
            <SidebarProvider defaultOpen={false}>
                <PublicSidebar />
                <SidebarInset className="relative">
                    <PublicHeader mcqMode={mcqMode} setMcqMode={setMcqMode} />
                    <div className="min-h-screen">
                        {/* Main Contents */}
                        {children}
                        {/* Call to Action */}
                        <CallToAction />
                        {/* Footer */}
                        <PublicFooter />
                    </div>
                    {isMobile && <AppMode mcqMode={mcqMode} setMcqMode={setMcqMode} className="fixed right-2 bottom-5" />}
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

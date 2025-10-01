// import { BreadcrumbItem } from '@/types';
import AppMode from '@/components/app-mode';
import CallToAction from '@/components/call-to-action';
import FlashHandler from '@/components/flash-handler';
import PublicFooter from '@/components/public-footer';
import { PublicSidebar } from '@/components/public-sidebar';
import PublicHeader from '@/components/site-header';

// import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useMcqMode } from '@/hooks/use-mcq-mode';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Toaster } from 'sonner';

interface Props {
    children: React.ReactNode;
    title: string;
}

export function PublicLayout({ children, title }: Props) {
    const { setMcqMode } = useMcqMode();
    const { mcqMode } = usePage<SharedData>().props;
    const isMobile = useIsMobile();
    return (
        <>
            <Head title={title} />
            <SidebarProvider defaultOpen={false}>
                <PublicSidebar />
                <SidebarInset className="relative">
                    <PublicHeader mcqMode={mcqMode} setMcqMode={setMcqMode} />
                    <FlashHandler />
                    <div className="min-h-screen">
                        {/* Main Contents */}
                        {children}
                        {/* Call to Action */}
                        <CallToAction />
                        {/* Footer */}
                        <PublicFooter />
                    </div>
                    {isMobile && <AppMode mcqMode={mcqMode} setMcqMode={setMcqMode} className="fixed right-2 bottom-5" />}

                    <Toaster position="bottom-center" duration={4000} expand={false} visibleToasts={5} />
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

// import { BreadcrumbItem } from '@/types';
import AppMode from '@/components/app-mode';
import { PublicSidebar } from '@/components/public-sidebar';
import PublicHeader from '@/components/site-header';

// import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Head } from '@inertiajs/react';

interface Props {
    children: React.ReactNode;
    title: string;
    setMcqMode: (mode: boolean) => void;
    mcqMode: boolean;
}

export function PublicLayout({ children, title, mcqMode, setMcqMode }: Props) {
    const isMobile = useIsMobile();
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Head>
            <SidebarProvider defaultOpen={false}>
                <PublicSidebar />
                <SidebarInset className="relative">
                    <PublicHeader mcqMode={mcqMode} setMcqMode={setMcqMode} />
                    {children}
                    {isMobile && <AppMode mcqMode={mcqMode} setMcqMode={setMcqMode} className="fixed right-2 bottom-5" />}
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

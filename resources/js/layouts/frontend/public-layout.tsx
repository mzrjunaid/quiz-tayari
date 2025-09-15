// import { BreadcrumbItem } from '@/types';
import { AppSidebar } from '@/components/app-sidebar';

// import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Head } from '@inertiajs/react';

interface Props {
    children: React.ReactNode;
    title: string;
}

export function PublicLayout({ children, title }: Props) {
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Head>
            <SidebarProvider className="flex flex-col">
                {/* <SiteHeader /> */}
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>{children}</SidebarInset>
                </div>
            </SidebarProvider>
        </>
    );
}

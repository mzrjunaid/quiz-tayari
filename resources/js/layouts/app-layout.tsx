import FlashHandler from '@/components/flash-handler';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <FlashHandler />
        {children}
        <Toaster position="top-right" duration={4000} closeButton={true} richColors={true} expand={true} visibleToasts={5} />
    </AppLayoutTemplate>
);

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, List, Paperclip, ScrollText, Trash, UserCircle2 } from 'lucide-react';
import AppLogo from './app-logo';
import { NavUser } from './nav-user';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'MCQs Rephrase',
        href: route('rephrase.index'),
        icon: ScrollText,
    },
    {
        title: 'Papers',
        href: route('papers.index'),
        icon: Paperclip,
    },
    {
        title: 'MCQs',
        href: route('mcqs.index'),
        icon: List,
    },
];

const adminFooterNavItems: NavItem[] = [
    {
        title: 'MCQs - Trash Bin',
        href: route('mcqs.trashbin'),
        icon: Trash,
    },
];

const userFooterNavItems: NavItem[] = [
    {
        title: 'Login',
        href: route('login'),
        icon: UserCircle2,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>{auth.user && <NavMain items={adminNavItems} />}</SidebarContent>

            <SidebarFooter>
                {!auth.user && <NavFooter items={userFooterNavItems} className="mt-auto" />}
                {auth.user && <NavFooter items={adminFooterNavItems} className="mt-auto" />}
                {auth.user && <NavUser />}
            </SidebarFooter>
        </Sidebar>
    );
}

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { adminFooterNavItems, adminNavItems, publicNavItems, userFooterNavItems } from '@/constants/menus';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';
import { NavUser } from './nav-user';

export function PublicSidebar() {
    const { auth } = usePage<SharedData>().props;
    return (
        <Sidebar collapsible="offcanvas" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch className='hover:bg-transparent'>
                                <AppLogo size='size-28' />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain navGroupTitle="Public" items={publicNavItems} />
                {auth.user && <NavMain navGroupTitle="Admin" items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                {!auth.user && <NavFooter items={userFooterNavItems} className="mt-auto" />}
                {auth.user && <NavFooter items={adminFooterNavItems} className="mt-auto" />}
                {auth.user && <NavUser />}
            </SidebarFooter>
        </Sidebar>
    );
}

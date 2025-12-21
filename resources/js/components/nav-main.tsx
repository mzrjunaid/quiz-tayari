import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { paperNavItems } from '@/constants/menus';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function NavMain({ items = [], navGroupTitle }: { items: NavItem[]; navGroupTitle: string }) {
    const { ziggy } = usePage<SharedData>().props;
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{navGroupTitle}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.subitems && item.subitems.length > 0 ? (
                        <Collapsible defaultOpen className="group/collapsible" key={item.title}>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton isActive={ziggy.location === item.href} tooltip={{ children: item.title }}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {paperNavItems.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuButton asChild isActive={ziggy.location === item.href} tooltip={{ children: item.title }}>
                                                    <Link href={item.href} prefetch>
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={ziggy.location === item.href} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

'use client';

import * as React from 'react';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { generalNavItems, paperNavItems } from '@/constants/menus';
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';

export function PublicNavigationMenu() {
    return (
        <NavigationMenu viewport={false} className="hidden lg:block">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Home</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink
                                    className="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden select-none focus:shadow-md"
                                    href="/"
                                >
                                    <div className="mt-4 mb-2 flex items-center text-lg font-medium">
                                        <AppLogo />
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                        Beautifully designed components built with Tailwind CSS.
                                    </p>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </ListItem>
                            <ListItem href="/docs/installation" title="Installation">
                                How to install dependencies and structure your app.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Papers</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                {paperNavItems.map((item, index) => (
                                    <NavigationMenuLink key={index} href={route(item.href)}>
                                        <div className="font-medium">{item.title}</div>
                                        {item.description && <div className="text-muted-foreground">{item.description}</div>}
                                    </NavigationMenuLink>
                                ))}
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">About Us</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4">
                            <li>
                                {generalNavItems.map((item, index) => (
                                    <NavigationMenuLink href={item.href} key={index + 1}>
                                        {item.title}
                                    </NavigationMenuLink>
                                ))}
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="/demo" className={navigationMenuTriggerStyle() + ` bg-transparent`}>
                        Demo
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

import { NavItem } from '@/types';
import { Home, List, Paperclip, ScrollText, Trash, UserCircle2 } from 'lucide-react';

export const generalNavItems: NavItem[] = [
    { title: 'Help Center', href: '/help-center' },
    { title: 'Contact Us', href: '/contact-us' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Terms of Service', href: '/terms-of-service' },
    { title: 'Join Us', href: '/join-us' },
];

export const publicNavItems: NavItem[] = [
    {
        title: 'Home',
        href: route('home'),
        icon: Home,
    },
    {
        title: 'Papers',
        href: route('public-papers.list'),
        icon: List,
    },
];

export const paperNavItems: NavItem[] = [
    {
        title: 'Past Papers',
        href: 'public-papers.list',
        description: 'Browse all Previous Papers from PPSC',
    },
    {
        title: 'Upcoming Papers',
        href: 'public-papers.list',
        description: 'Practice Upcoming Papers with AI',
    },
];

export const adminNavItems: NavItem[] = [
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

export const adminFooterNavItems: NavItem[] = [
    {
        title: 'MCQs - Trash Bin',
        href: route('mcqs.trashbin'),
        icon: Trash,
    },
];

export const userFooterNavItems: NavItem[] = [
    {
        title: 'Login',
        href: route('login'),
        icon: UserCircle2,
    },
];

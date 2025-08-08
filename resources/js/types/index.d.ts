import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface OldMcqs {
    q_id: string;
    q_statement: string;
    option_A: string;
    option_B: string;
    option_C: string;
    option_D: string;
    right_choice: string;
    created_at: string;
}

export interface Mcqs {
    id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d?: string;
    correct_answer: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;

    question_type?: string;
    subject?: string;
    tags?: string[] | null;
    reference?: string[] | null;
}

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

export interface DashboardProps<T = unknown> {
    latest_mcqs?: T[];
    stats: {
        mcqs_stats: {
            total_mcqs: number;
            total_papers: number;
            old_mcqs: number;
        };
        recent_activity: {
            mcqs_today: number;
            updated_today: number;
            papers_this_week: number;
        };
        rephrase_stats: {
            total_rephrased: number;
            pending_count: number;
        };
        data_entry_metrics: {
            avg_mcqs_per_paper: number;
        };
    };
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
    is_rephrased: string;
}

export interface Mcqs {
    id: string;
    serial_number?: number;
    slug: string;
    question: string;
    explanation: string;
    options: {
        A: string;
        B?: string;
        C?: string;
        D?: string;
        E?: string;
    };
    correct_answer: string;
    correct_answers: string[];
    subject: string;
    topic: string;
    difficulty_level: 'easy' | 'medium' | 'hard' | undefined;
    question_type: 'single' | 'multiple' | 'true_false' | 'single_a' | undefined;
    language: 'en' | 'ur' | undefined;
    is_active: boolean;
    is_verified: boolean;
    current_affair: boolean;
    general_knowledge: boolean;
    created_by: User;
    updated_by: User;
    verified_by: User;
    tags: string[];
    exam_types: string[];
    paper: Paper;
    created_at_human: string;
    updated_at_human: string;
    created_at_datetime: string;
    updated_at_datetime: string;
    deleted_at_datetime: string;
    status: string;
}

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
};

export interface Paper {
    id: string;
    slug: string;
    serial_number?: number;
    title: string;
    description: string;
    testing_service: {
        short: string;
        long: string;
    };
    department: string;
    subject: string;
    scheduled_at: {
        datetime: string;
        human: string;
        formatted: string;
        date_only: string;
        time_only: string;
    };
    status: {
        is_scheduled: boolean;
        is_today: boolean;
        is_upcoming: boolean;
        is_past: boolean;
    };
    meta: {
        has_description: boolean;
        has_testing_service: boolean;
    };
    created_at: {
        datetime: string;
        human: string;
        formatted: string;
    };
    updated_at: {
        datetime: string;
        human: string;
        formatted: string;
    };
}

export type SerializableFilterValue = string | number;

export interface Filters {
    search?: string;
    is_active?: string;
    is_verified?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
}

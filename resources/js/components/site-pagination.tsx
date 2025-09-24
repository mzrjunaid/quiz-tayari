import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationProps } from '@/types';

import { router } from '@inertiajs/react';

function getVisiblePages(current: number, last: number, delta = 1): (number | string)[] {
    const range: (number | string)[] = [];
    const left = current - delta;
    const right = current + delta;

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= left && i <= right)) {
            range.push(i);
        } else if (range[range.length - 1] !== '...') {
            range.push('...');
        }
    }

    return range;
}

export function SitePagination({ meta, links, scrollRef }: PaginationProps) {
    if (!meta || !links) return null;

    const pages = getVisiblePages(meta.current_page, meta.last_page);

    const handleNavigate = (url: string | null) => {
        if (!url) return;
        router.visit(url, {
            preserveScroll: true, // 👈 inertia keeps position
            onSuccess: () => {
                // 👇 after page load, scroll to your ref
                scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
        });
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigate(links.prev);
                        }}
                        aria-disabled={!links.prev}
                        className={!links.prev ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {/* Pages */}
                {pages.map((page, idx) => (
                    <PaginationItem key={idx}>
                        {page === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                size="sm"
                                isActive={meta.current_page === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigate(`?page=${page}`);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigate(links.next);
                        }}
                        aria-disabled={!links.next}
                        className={!links.next ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

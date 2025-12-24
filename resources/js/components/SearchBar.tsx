'use client';

import { ArrowRight, Clock, Loader2, Search, TrendingUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchResult {
    slug: string;
    title: string;
    link: string;
    type: 'mcq' | 'paper' | 'topic' | string;
    description?: string;
}

interface SearchBarProps {
    placeholder?: string;
    redirectOnSubmit?: boolean;
}

export default function SearchBar({ placeholder = 'Search MCQs, Papers, or Topics...', redirectOnSubmit = true }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /* ------------------ Load recent searches ------------------ */
    useEffect(() => {
        setRecentSearches(['PPSC', 'FPSC', 'General Knowledge']);
    }, []);

    /* ------------------ Fetch suggestions (debounced) ------------------ */
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchTerm)}`, { signal: controller.signal });

                if (!res.ok) throw new Error('Search failed');

                setSuggestions(await res.json());
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error(error);
                }
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [searchTerm]);

    /* ------------------ Outside click ------------------ */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const submitSearch = () => {
        if (!searchTerm.trim()) return;

        setRecentSearches((prev) => [searchTerm, ...prev.filter((s) => s !== searchTerm)].slice(0, 5));

        if (redirectOnSubmit) {
            console.log('Redirect to search:', searchTerm);
        }

        setIsFocused(false);
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'mcq':
                return 'bg-blue-100 text-blue-700';
            case 'paper':
                return 'bg-purple-100 text-purple-700';
            case 'topic':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div ref={dropdownRef} className="relative mx-auto max-w-2xl">
            {/* Input */}
            <div className={`relative flex items-center rounded-lg bg-white transition ${isFocused ? 'shadow-lg ring-2 ring-primary' : 'shadow-md'}`}>
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />

                <Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                    placeholder={placeholder}
                    className="border-0 py-4 pr-24 pl-12"
                />

                <div className="absolute right-2 flex items-center gap-1">
                    {loading && <Loader2 className="h-5 w-5 animate-spin" />}

                    {searchTerm && !loading && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => setSearchTerm('')}>
                            <X />
                        </Button>
                    )}

                    {searchTerm && (
                        <Button type="button" size="icon" onClick={submitSearch}>
                            <ArrowRight />
                        </Button>
                    )}
                </div>
            </div>

            {/* Dropdown */}
            {isFocused && (
                <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-xl">
                    {!searchTerm && (
                        <div className="border-b p-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase">
                                <Clock className="h-4 w-4" />
                                Recent
                            </div>

                            {recentSearches.map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchTerm(term)}
                                    className="w-full rounded-lg px-3 py-2 text-left hover:bg-muted"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}

                    {searchTerm && (
                        <div className="max-h-96 overflow-y-auto p-2">
                            {loading ? (
                                <div className="py-8 text-center">
                                    <Loader2 className="mx-auto animate-spin" />
                                </div>
                            ) : suggestions.length ? (
                                suggestions.map((item) => (
                                    <a key={item.slug} href={item.link} className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted">
                                        <span className={`rounded px-2 py-0.5 text-xs ${getTypeColor(item.type)}`}>{item.type}</span>
                                        <div className="flex-1">
                                            <p className="font-medium">{item.title}</p>
                                            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <p className="py-8 text-center text-sm">No results found</p>
                            )}
                        </div>
                    )}

                    {!searchTerm && (
                        <div className="border-t p-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase">
                                <TrendingUp className="h-4 w-4" />
                                Trending
                            </div>

                            {['General Knowledge', 'PPSC', 'FPSC'].map((tag) => (
                                <Button key={tag} variant="secondary" size="sm" onClick={() => setSearchTerm(tag)} className="mr-2 mb-2">
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

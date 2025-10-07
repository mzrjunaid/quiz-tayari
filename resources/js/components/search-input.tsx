'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const FormSchema = z.object({
    query: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
});

interface SearchInputProps {
    query?: string;
}

const SearchInput: React.FC<SearchInputProps> = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            query: '',
        },
    });

    // console.log(query);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast(`You submitted the following values, ${data.query}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem className="flex items-center">
                            <FormControl>
                                <div className="relative w-full flex-1">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                                    <Input
                                        type="text"
                                        placeholder="Search here..."
                                        className="w-full rounded-lg bg-input py-5 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:outline-none"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <Button variant={'outline'} type="submit">
                                Search
                            </Button>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default SearchInput;

// import { Link, router } from '@inertiajs/react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Loader2 } from 'lucide-react';
// import { useEffect, useState } from 'react';

// interface SearchResult {
//     id: number;
//     slug: string;
//     title: string;
//     link: string; // optional custom link
//     type: string;
// }

// interface SearchBarProps {
//     placeholder?: string;
//     redirectOnSubmit?: boolean; // whether pressing Enter redirects
// }

// export function SearchBar({ placeholder = 'Search MCQs, Papers, or Topics...', redirectOnSubmit = true }: SearchBarProps) {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);

//     // 🔹 Fetch suggestions via API (debounced)
//     useEffect(() => {
//         if (!searchTerm.trim()) {
//             setSuggestions([]);
//             return;
//         }

//         const delay = setTimeout(async () => {
//             setLoading(true);
//             try {
//                 const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchTerm)}`);
//                 const data = await res.json();
//                 setSuggestions(data);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         }, 400);

//         return () => clearTimeout(delay);
//     }, [searchTerm]);

//     // 🔹 Handle full search submission
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (redirectOnSubmit && searchTerm.trim()) {
//             router.get(route('search'), { q: searchTerm }, { replace: true });
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-md text-gray-800">
//             <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
//             <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onFocus={() => setShowDropdown(true)}
//                 onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//                 placeholder={placeholder}
//                 className="w-full rounded-lg border py-2 pr-10 pl-10 focus:ring focus:ring-blue-200"
//             />

//             {loading && <Loader2 className="absolute top-2.5 right-3 h-5 w-5 animate-spin text-blue-500" />}

//             {/* 🔹 Dropdown Results */}
//             <AnimatePresence>
//                 {showDropdown && searchTerm && (
//                     <motion.ul
//                         initial={{ opacity: 0, y: -5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -5 }}
//                         className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
//                     >
//                         {loading ? (
//                             <li className="flex items-center gap-2 px-4 py-3 ">
//                                 <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//                                 Searching…
//                             </li>
//                         ) : suggestions.length > 0 ? (
//                             suggestions.map((item) => (
//                                 <li key={item.id}>
//                                     <Link href={item.link} className="block px-4 py-2 text-gray-700 transition hover:bg-blue-50">
//                                         {item.title}
//                                     </Link>
//                                 </li>
//                             ))
//                         ) : (
//                             <li className="px-4 py-3 ">No results for “{searchTerm}”</li>
//                         )}
//                     </motion.ul>
//                 )}
//             </AnimatePresence>
//         </form>
//     );
// }

import { ArrowRight, Clock, Loader2, TrendingUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchResult {
    id: number;
    slug: string;
    title: string;
    link: string;
    type: string;
    description?: string;
}

interface SearchBarProps {
    placeholder?: string;
    redirectOnSubmit?: boolean;
}

export function SearchBar({ placeholder = 'Search MCQs, Papers, or Topics...', redirectOnSubmit = true }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load recent searches from memory
    useEffect(() => {
        const stored = ['Medical Anatomy', 'Biology Chapter 5', 'Physics MCQs'];
        setRecentSearches(stored);
    }, []);

    // Fetch suggestions with debouncing
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSuggestions([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);

            try {
                const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchTerm)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    signal: AbortSignal.timeout(5000), // 5 second timeout
                });

                if (!response.ok) {
                    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
                }

                const data: SearchResult[] = await response.json();
                setSuggestions(data);
            } catch (err) {
                // Handle different error types appropriately
                if (err instanceof Error) {
                    if (err.name === 'AbortError') {
                        console.error('Search request timeout');
                    } else {
                        console.error('Search error:', err.message);
                    }
                }

                // Clear suggestions on error to show empty state
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [searchTerm]);

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (redirectOnSubmit && searchTerm.trim()) {
            // Save to recent searches
            const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
            setRecentSearches(updated);

            // Replace with actual navigation - Inertia router.get(route('search'), { q: searchTerm })
            console.log('Redirecting to search:', searchTerm);
            setShowDropdown(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const handleRecentClick = (term: string) => {
        setSearchTerm(term);
        inputRef.current?.focus();
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
        <div className="relative mx-auto w-full max-w-2xl" ref={dropdownRef}>
            <div className="relative">
                {/* Search Input */}
                <div
                    className={`relative flex items-center transition-all duration-200 ${
                        focused ? 'shadow-lg ring-2 ring-primary' : 'shadow-md hover:shadow-lg'
                    } rounded-xl bg-white`}
                >
                    <Search className={`absolute left-4 h-5 w-5 transition-colors ${focused ? 'text-primary' : 'text-gray-400'}`} />

                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onFocus={() => {
                            setShowDropdown(true);
                            setFocused(true);
                        }}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border-0 py-4 pr-24 pl-12 text-base placeholder-gray-400 focus:outline-none"
                        autoComplete="off"
                    />

                    {/* Right Actions */}
                    <div className="absolute right-2 flex items-center gap-2">
                        {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}

                        {searchTerm && !loading && (
                            <Button variant="ghost" size="icon" onClick={handleClear} className="rounded-full transition">
                                <X className="h-3 w-3" />
                            </Button>
                        )}

                        {searchTerm && (
                            <Button
                                variant="default"
                                size="icon"
                                onClick={handleSearch}
                                className="flex items-center gap-1.5 rounded px-4 py-2 text-sm font-medium transition"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-xl">
                    {/* Recent Searches (when no search term) */}
                    {!searchTerm && recentSearches.length > 0 && (
                        <div className="border-b border-gray-100 p-3">
                            <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold tracking-wide uppercase">
                                <Clock className="h-3.5 w-3.5" />
                                Recent Searches
                            </div>
                            <div className="space-y-1">
                                {recentSearches.map((term, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleRecentClick(term)}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition"
                                    >
                                        <Search className="h-4 w-4 text-gray-400" />
                                        <span>{term}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    {searchTerm && (
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center gap-2 py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <span className="text-sm">Searching...</span>
                                </div>
                            ) : suggestions.length > 0 ? (
                                <div className="p-2">
                                    <div className="mb-2 px-2 text-xs font-medium">
                                        {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} found
                                    </div>
                                    {suggestions.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.link}
                                            className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-primary/85"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${getTypeColor(item.type)}`}>
                                                        {item.type}
                                                    </span>
                                                    <h4 className="truncate text-sm font-medium group-hover:text-primary-foreground">{item.title}</h4>
                                                </div>
                                                {item.description && <p className="mt-1 text-xs">{item.description}</p>}
                                            </div>
                                            <ArrowRight className="h-4 w-4 flex-shrink-0 opacity-0 transition group-hover:opacity-100" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <p className="text-sm font-medium">No results found</p>
                                    <p className="mt-1 text-xs">Try searching with different keywords</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Trending Topics */}
                    {!searchTerm && (
                        <div className="border-t border-gray-100 bg-gray-50 p-3">
                            <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold tracking-wide uppercase">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Trending Topics
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Medical MCQs', 'MDCAT 2024', 'Biology Notes'].map((tag) => (
                                    <Button
                                        key={tag}
                                        onClick={() => handleRecentClick(tag)}
                                        className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-blue-50 hover:text-primary"
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

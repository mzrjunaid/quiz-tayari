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

import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchResult {
    id: number;
    title: string;
    link: string; // optional custom link
    type: string;
}

interface SearchBarProps {
    placeholder?: string;
    redirectOnSubmit?: boolean; // whether pressing Enter redirects
}

export function SearchBar({ placeholder = 'Search MCQs, Papers, or Topics...', redirectOnSubmit = true }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // 🔹 Fetch suggestions via API (debounced)
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSuggestions([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchTerm)}`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [searchTerm]);

    // 🔹 Handle full search submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (redirectOnSubmit && searchTerm.trim()) {
            router.get(route('search'), { q: searchTerm }, { replace: true });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-md text-gray-800">
            <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder={placeholder}
                className="w-full rounded-lg border py-2 pr-10 pl-10 focus:ring focus:ring-blue-200"
            />

            {loading && <Loader2 className="absolute top-2.5 right-3 h-5 w-5 animate-spin text-blue-500" />}

            {/* 🔹 Dropdown Results */}
            <AnimatePresence>
                {showDropdown && searchTerm && (
                    <motion.ul
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
                    >
                        {loading ? (
                            <li className="flex items-center gap-2 px-4 py-3 text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                Searching…
                            </li>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((item) => (
                                <li key={item.id}>
                                    <Link href={item.link} className="block px-4 py-2 text-gray-700 transition hover:bg-blue-50">
                                        {item.title}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-gray-500">No results for “{searchTerm}”</li>
                        )}
                    </motion.ul>
                )}
            </AnimatePresence>
        </form>
    );
}

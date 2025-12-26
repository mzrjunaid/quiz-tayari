'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const searchSchema = z.object({
    searchQuery: z.string().min(2, 'Search term must be at least 2 characters'),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchInputProps {
    defaultQuery?: string;
    onSearch?: (query: string) => void;
}

const SearchInput = ({ defaultQuery = '', onSearch }: SearchInputProps) => {
    const form = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: { searchQuery: defaultQuery },
    });

    const handleSubmit = ({ searchQuery }: SearchFormValues) => {
        onSearch?.(searchQuery);
        toast(`Searching for: ${searchQuery}`);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-center gap-2">
                <FormField
                    control={form.control}
                    name="searchQuery"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input {...field} placeholder="Search here..." className="py-5 pl-10" />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="outline">
                    Search
                </Button>
            </form>
        </Form>
    );
};

export default SearchInput;

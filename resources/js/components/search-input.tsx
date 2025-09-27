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

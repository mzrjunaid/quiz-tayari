import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// const data = ['next.js', 'sveltekit', 'SvelteKit', 'nuxt.js', 'Nuxt.js', 'remix', 'Remix', 'astro', 'Astro'];

type Option = {
    value: string;
    label: string;
};

interface Props {
    data: (string | Option)[];
    placeholder: string;
    buttonStyle?: string;
    contentStyle?: string;
    onChange?: (selected: Option | null) => void; // 🔹 callback
}

export function SelectBySearch({ data, placeholder, buttonStyle, contentStyle, onChange }: Props) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    // 🔹 Normalize into consistent object structure
    const list: Option[] = React.useMemo(() => {
        return data.map((item) => (typeof item === 'string' ? { value: item.toLowerCase(), label: item } : { value: item.value, label: item.label }));
    }, [data]);

    const selectedOption = list.find((option) => option.value === value);

    const handleSelect = (currentValue: string) => {
        const newValue = currentValue === value ? '' : currentValue;
        setValue(newValue);
        setOpen(false);

        const selected = list.find((opt) => opt.value === newValue) || null;
        onChange?.(selected); // 🔹 notify parent
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={`w-[200px] justify-between ${buttonStyle}`}>
                    {selectedOption?.label ?? placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-[200px] p-0 ${contentStyle}`}>
                <Command>
                    <CommandInput placeholder={placeholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {list.map((option) => (
                                <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                                    {option.label}
                                    <Check className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

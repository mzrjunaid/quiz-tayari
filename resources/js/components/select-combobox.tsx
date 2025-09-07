'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { truncate } from 'lodash';

export function SelectCombobox({
    data,
    value: externalValue,
    onValueChange,
    placeholder = 'Select paper...',
    searchPlaceholder = 'Search papers...',
    emptyMessage = 'No paper found.',
}: {
    data: Array<{
        id: string;
        title: string;
    }>;
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
}) {
    const [open, setOpen] = React.useState(false);
    // Use external value if provided, otherwise use internal state
    const [internalValue, setInternalValue] = React.useState('');
    const value = externalValue !== undefined ? externalValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (onValueChange) {
            // Controlled component - notify parent
            onValueChange(newValue);
        } else {
            // Uncontrolled component - update internal state
            setInternalValue(newValue);
        }
    };

    // Find the selected item
    const selectedItem = data.find((item) => item.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    title={selectedItem?.title || placeholder}
                >
                    {selectedItem ? truncate(selectedItem.title, { length: 20 }) : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={item.title}
                                    onSelect={(currentValue) => {
                                        // Find the item by title to get the ID
                                        const selectedItem = data.find((d) => d.title === currentValue);
                                        if (selectedItem) {
                                            // Toggle selection: if same ID is clicked, deselect it
                                            const newValue = selectedItem.id === value ? '' : selectedItem.id;
                                            handleValueChange(newValue);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    {item.title}
                                    <Check className={cn('ml-auto', value === item.id ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

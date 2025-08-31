import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from '@/components/ui/multi-select';
import { formSchema } from '@/types/zodSchema';
import { Plus, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

// Define the form values type (should match your main component's FormValues)
type FormValues = z.infer<typeof formSchema>;

interface TagsExamTypesSectionProps {
    form: UseFormReturn<FormValues>;
    dynamicTags: Array<{ id: string; name: string }>;
    dynamicExamTypes: Array<{ id: string; name: string }>;
    showAddTag: boolean;
    showAddExamType: boolean;
    newTagName: string;
    newExamTypeName: string;
    setShowAddTag: (show: boolean) => void;
    setShowAddExamType: (show: boolean) => void;
    setNewTagName: (name: string) => void;
    setNewExamTypeName: (name: string) => void;
    addNewTag: () => void;
    addNewExamType: () => void;
}

// Custom MultiSelect component with better wrapping
const CustomMultiSelectTrigger = ({
    children,
    className = '',
    ...props
}: React.PropsWithChildren<{ className?: string } & React.HTMLAttributes<HTMLDivElement>>) => (
    <div
        className={`flex min-h-10 w-full items-start justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    >
        <div className="flex max-w-full flex-wrap items-center gap-1">{children}</div>
    </div>
);

// Component for displaying selected values as wrapped badges
const SelectedValuesBadges = ({ values, onRemove }: { values: string[]; onRemove: (value: string) => void }) => {
    if (!values || values.length === 0) {
        return <span className="text-muted-foreground">Select options...</span>;
    }

    return (
        <div className="flex max-w-full flex-wrap gap-1">
            {values.map((value) => (
                <Badge key={value} variant="secondary" className="flex max-w-full items-center gap-1 text-xs">
                    <span className="truncate">{value}</span>
                    <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(value);
                        }}
                    />
                </Badge>
            ))}
        </div>
    );
};

export function TagsExamTypesSection({
    form,
    dynamicTags,
    dynamicExamTypes,
    showAddTag,
    showAddExamType,
    newTagName,
    newExamTypeName,
    setShowAddTag,
    setShowAddExamType,
    setNewTagName,
    setNewExamTypeName,
    addNewTag,
    addNewExamType,
}: TagsExamTypesSectionProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tags *</FormLabel>
                        <div className="space-y-2">
                            <div className="relative">
                                <CustomMultiSelectTrigger
                                    onClick={() => {
                                        /* Handle dropdown open */
                                    }}
                                    className="cursor-pointer"
                                >
                                    <SelectedValuesBadges
                                        values={Array.isArray(field.value) ? field.value : []}
                                        onRemove={(valueToRemove) => {
                                            const currentValues = Array.isArray(field.value) ? field.value : [];
                                            field.onChange(currentValues.filter((v) => v !== valueToRemove));
                                        }}
                                    />
                                </CustomMultiSelectTrigger>

                                <MultiSelect values={Array.isArray(field.value) ? field.value : []} onValuesChange={field.onChange}>
                                    <MultiSelectTrigger className="absolute inset-0 cursor-pointer opacity-0">
                                        <MultiSelectValue placeholder="Select tags" />
                                    </MultiSelectTrigger>
                                    <MultiSelectContent>
                                        {dynamicTags.map((tag) => (
                                            <MultiSelectItem key={tag.id} value={tag.name}>
                                                {tag.name}
                                            </MultiSelectItem>
                                        ))}
                                    </MultiSelectContent>
                                </MultiSelect>
                            </div>

                            {showAddTag ? (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter new tag name"
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                                    />
                                    <Button type="button" size="sm" onClick={addNewTag} disabled={!newTagName.trim()}>
                                        Add
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddTag(false);
                                            setNewTagName('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddTag(true)} className="w-full">
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add New Tag
                                </Button>
                            )}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="exam_types"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Exam Types</FormLabel>
                        <div className="space-y-2">
                            <div className="relative">
                                <CustomMultiSelectTrigger
                                    onClick={() => {
                                        /* Handle dropdown open */
                                    }}
                                    className="cursor-pointer"
                                >
                                    <SelectedValuesBadges
                                        values={field.value || []}
                                        onRemove={(valueToRemove) => {
                                            const currentValues = field.value || [];
                                            field.onChange(currentValues.filter((v) => v !== valueToRemove));
                                        }}
                                    />
                                </CustomMultiSelectTrigger>

                                <MultiSelect values={field.value || []} onValuesChange={field.onChange}>
                                    <MultiSelectTrigger className="absolute inset-0 cursor-pointer opacity-0">
                                        <MultiSelectValue placeholder="Select exam types (optional)" />
                                    </MultiSelectTrigger>
                                    <MultiSelectContent>
                                        {dynamicExamTypes.map((examType) => (
                                            <MultiSelectItem key={examType.id} value={examType.name}>
                                                {examType.name}
                                            </MultiSelectItem>
                                        ))}
                                    </MultiSelectContent>
                                </MultiSelect>
                            </div>

                            {showAddExamType ? (
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter new exam type name"
                                        value={newExamTypeName}
                                        onChange={(e) => setNewExamTypeName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addNewExamType()}
                                    />
                                    <Button type="button" size="sm" onClick={addNewExamType} disabled={!newExamTypeName.trim()}>
                                        Add
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setShowAddExamType(false);
                                            setNewExamTypeName('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddExamType(true)} className="w-full">
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add New Exam Type
                                </Button>
                            )}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

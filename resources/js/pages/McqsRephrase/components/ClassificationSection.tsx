import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formSchema } from '@/types/zodSchema';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

// Define the form values type (should match your main component's FormValues)
type FormValues = z.infer<typeof formSchema>;

interface ClassificationSectionProps {
    form: UseFormReturn<FormValues>;
    subjects: Array<{ id: string; name: string }>;
    subject?: string;
    availableTopics: Array<{ id: string; name: string; subject_id: string }>;
    currentSubject: string;
}

export function ClassificationSection({ form, subjects, availableTopics, currentSubject }: ClassificationSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Classification</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    form.setValue('topic', '');
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Topic *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!currentSubject}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                !currentSubject
                                                    ? 'Select subject first'
                                                    : availableTopics.length === 0
                                                      ? 'No topics available'
                                                      : 'Select topic'
                                            }
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {availableTopics.map((topic) => (
                                        <SelectItem key={topic.id} value={topic.id}>
                                            {topic.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="difficulty_level"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Difficulty Level *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}

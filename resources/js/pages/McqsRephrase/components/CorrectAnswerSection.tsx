import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

// Define the form values type (should match your main component's FormValues)
interface FormValues {
    question: string;
    explanation: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    option_e: string;
    correct_answer: string | string[];
    subject: string;
    topic: string;
    difficulty_level: 'easy' | 'medium' | 'hard';
    question_type: 'single' | 'multiple' | 'true_false' | 'single_a';
    tags: string[];
    exam_types: string[];
}

interface CorrectAnswerSectionProps {
    form: UseFormReturn<FormValues>;
    currentQuestionType: string;
    getAvailableOptions: () => { value: string; label: string; content: string }[];
}

export function CorrectAnswerSection({ form, currentQuestionType, getAvailableOptions }: CorrectAnswerSectionProps) {
    return (
        <FormField
            control={form.control}
            name="correct_answer"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Correct Answer{currentQuestionType === 'multiple' ? 's' : ''} *
                        {currentQuestionType === 'multiple' && (
                            <span className="ml-2 text-sm text-muted-foreground">(Select at least 2 options)</span>
                        )}
                    </FormLabel>
                    {currentQuestionType === 'multiple' ? (
                        <FormControl>
                            <MultiSelect values={Array.isArray(field.value) ? field.value : []} onValuesChange={field.onChange}>
                                <MultiSelectTrigger>
                                    <MultiSelectValue placeholder="Select correct answers" />
                                </MultiSelectTrigger>
                                <MultiSelectContent>
                                    {getAvailableOptions().map((option) => (
                                        <MultiSelectItem key={option.value} value={option.value}>
                                            {option.label}: {option.content}
                                        </MultiSelectItem>
                                    ))}
                                </MultiSelectContent>
                            </MultiSelect>
                        </FormControl>
                    ) : (
                        <Select
                            onValueChange={field.onChange}
                            value={Array.isArray(field.value) ? field.value[0] : field.value}
                            disabled={currentQuestionType === 'single_a'}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select correct answer" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {currentQuestionType === 'true_false' ? (
                                    <>
                                        <SelectItem value="A">True</SelectItem>
                                        <SelectItem value="B">False</SelectItem>
                                    </>
                                ) : (
                                    getAvailableOptions().map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}: {option.content}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

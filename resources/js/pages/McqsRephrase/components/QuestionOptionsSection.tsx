import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

interface QuestionOptionsSectionProps {
    form: UseFormReturn<FormValues>;
    currentQuestionType: string;
}

export function QuestionOptionsSection({ form, currentQuestionType }: QuestionOptionsSectionProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Answer Options</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="option_a"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Option A *</FormLabel>
                            <FormControl>
                                <Input disabled={currentQuestionType === 'true_false'} placeholder="Enter option A" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {currentQuestionType !== 'single_a' && (
                    <FormField
                        control={form.control}
                        name="option_b"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Option B {(currentQuestionType === 'multiple' || currentQuestionType === 'single') && '*'}</FormLabel>
                                <FormControl>
                                    <Input disabled={currentQuestionType === 'true_false'} placeholder="Enter option B" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {currentQuestionType !== 'single_a' && currentQuestionType !== 'true_false' && (
                    <>
                        <FormField
                            control={form.control}
                            name="option_c"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Option C {currentQuestionType === 'multiple' && '*'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter option C" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="option_d"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Option D</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter option D" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="option_e"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Option E</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter option E" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

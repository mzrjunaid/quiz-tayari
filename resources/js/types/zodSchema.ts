import z from 'zod';

export const formSchema = z
    .object({
        question: z.string().min(1, 'Question is required').min(10, 'Question must be at least 10 characters'),
        explanation: z.string().min(1, 'Explanation is required').min(10, 'Explanation must be at least 10 characters'),
        option_a: z.string().min(1, 'Option A is required'),
        option_b: z.string(),
        option_c: z.string(),
        option_d: z.string(),
        option_e: z.string(),
        correct_answer: z.union([
            z.enum(['A', 'B', 'C', 'D', 'E']),
            z.array(z.enum(['A', 'B', 'C', 'D', 'E'])).min(1, 'At least one correct answer is required'),
            z.string().min(1, 'Correct answer is required'),
        ]),
        subject: z.string().min(1, 'Subject is required'),
        topic: z.string().min(1, 'Topic is required'),
        difficulty_level: z.enum(['easy', 'medium', 'hard']),
        question_type: z.enum(['single', 'multiple', 'true_false', 'single_a']),
        tags: z.array(z.string()).min(1, 'At least one tag is required'),
        exam_types: z.array(z.string()),
        core_concept: z.string().optional(),
        current_affair: z.boolean().optional(),
        general_knowledge: z.boolean().optional(),
        language: z.enum(['en', 'ur']).optional(),
        is_rephrased_added: z.boolean().optional(),
    })
    .refine(
        (data) => {
            if (data.question_type === 'multiple') {
                return data.option_b && data.option_c && data.option_b.length > 0 && data.option_c.length > 0;
            }
            return true;
        },
        {
            message: 'Multiple choice questions require at least options A, B, and C',
            path: ['option_b'],
        },
    )
    .refine(
        (data) => {
            if (data.question_type === 'multiple' && Array.isArray(data.correct_answer)) {
                return data.correct_answer.length >= 2;
            }
            return true;
        },
        {
            message: 'Multiple choice questions must have at least 2 correct answers',
            path: ['correct_answer'],
        },
    );

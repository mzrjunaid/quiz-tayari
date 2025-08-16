import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, OldMcqs } from '@/types';
import { Head, useForm } from '@inertiajs/react';

export interface EditProps {
    mcq: OldMcqs;
    rephrased: string;
    explanation: string;
    subject: string;
    current_affair: boolean;
    general_knowledge: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit MCQ',
        href: '/edit',
    },
];

export default function Edit({ mcq, rephrased, explanation, subject, current_affair, general_knowledge }: EditProps) {
    const { data, setData, errors, reset, post, processing } = useForm({
        rephrased: rephrased || '',
        option_a: mcq.option_A || '',
        option_b: mcq.option_B || '',
        option_c: mcq.option_C || '',
        option_d: mcq?.option_D || '',
        correct_answer: mcq.right_choice || '',
        explanation: explanation || '',
        subject: subject || '',
        current_affair: Boolean(current_affair),
        general_knowledge: Boolean(general_knowledge),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('mcq.store', data));
    };

    const handleReset = () => {
        reset();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Rephrased MCQ" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="grid w-full gap-2">
                        <Label htmlFor="rephrased" className="block">
                            Rephrased MCQ Statement
                        </Label>
                        <Textarea
                            placeholder="Question Statement"
                            value={data.rephrased}
                            onChange={(e) => setData('rephrased', e.target.value)}
                            className="resize-none"
                            id="rephrased"
                            required
                        />
                        {errors.rephrased && <span className="text-sm text-red-500">{errors.rephrased}</span>}
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="option_a" className="block">
                            Option A
                        </Label>
                        <Input type="text" value={data.option_a} onChange={(e) => setData('option_a', e.target.value)} id="option_a" required />
                        {errors.option_a && <span className="text-sm text-red-500">{errors.option_a}</span>}
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="option_b" className="block">
                            Option B
                        </Label>
                        <Input type="text" value={data.option_b} onChange={(e) => setData('option_b', e.target.value)} id="option_b" required />
                        {errors.option_b && <span className="text-sm text-red-500">{errors.option_b}</span>}
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="option_c" className="block">
                            Option C
                        </Label>
                        <Input type="text" value={data.option_c} onChange={(e) => setData('option_c', e.target.value)} id="option_c" required />
                        {errors.option_c && <span className="text-sm text-red-500">{errors.option_c}</span>}
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="option_d" className="block">
                            Option D
                        </Label>
                        <Input type="text" value={data.option_d} onChange={(e) => setData('option_d', e.target.value)} id="option_d" />
                        {errors.option_d && <span className="text-sm text-red-500">{errors.option_d}</span>}
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="correct_option" className="block">
                            Correct Option
                        </Label>
                        <Select value={data.correct_answer} onValueChange={(value) => setData('correct_answer', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                {data.option_d && <SelectItem value="D">D</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="explanation" className="block">
                            Explanation
                        </Label>
                        <Textarea
                            placeholder="Question Explanation"
                            value={data.explanation}
                            onChange={(e) => setData('explanation', e.target.value)}
                            className="resize-none"
                            id="explanation"
                        />
                        {errors.explanation && <span className="text-sm text-red-500">{errors.explanation}</span>}
                    </div>
                    <div className="grid w-full gap-2">
                        <Label htmlFor="subject" className="block">
                            Subject
                        </Label>
                        <Input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            id="subject"
                            placeholder="Enter subject"
                        />
                        {errors.subject && <span className="text-sm text-red-500">{errors.subject}</span>}
                    </div>
                    <div className="flex w-full gap-2">
                        <Checkbox id="ca" checked={data.current_affair} onCheckedChange={() => setData('current_affair', !data.current_affair)} />
                        <Label htmlFor="ca" className="block">
                            Current Affairs
                        </Label>
                    </div>
                    <div className="flex w-full gap-2">
                        <Checkbox
                            id="gk"
                            checked={data.general_knowledge}
                            onCheckedChange={() => setData('general_knowledge', !data.general_knowledge)}
                        />
                        <Label htmlFor="gk" className="block">
                            General Knowledge
                        </Label>
                    </div>

                    <div className="flex w-full max-w-sm gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleReset} disabled={processing}>
                            Reset
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

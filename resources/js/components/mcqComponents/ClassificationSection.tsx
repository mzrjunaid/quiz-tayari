import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formSchema } from '@/types/zodSchema';
import { PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
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
    onAddNewSubject?: (name: string) => void;
    onAddNewTopic?: (name: string, subjectId: string) => void;
}

export function ClassificationSection({
    form,
    subjects,
    availableTopics,
    currentSubject,
    onAddNewSubject,
    onAddNewTopic,
}: ClassificationSectionProps) {
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showAddTopic, setShowAddTopic] = useState(false);
    const [manualSubjectName, setManualSubjectName] = useState('');
    const [manualTopicName, setManualTopicName] = useState('');
    const [addedSubject, setAddedSubject] = useState<{ id: string; name: string } | null>(null);
    const [addedTopic, setAddedTopic] = useState<{ id: string; name: string } | null>(null);

    const handleAddSubject = () => {
        if (manualSubjectName.trim() && onAddNewSubject) {
            const newSubjectId = `new-${Date.now()}`;
            onAddNewSubject(manualSubjectName);
            setAddedSubject({ id: newSubjectId, name: manualSubjectName });
            form.setValue('subject', manualSubjectName, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
            setManualSubjectName('');
            setShowAddSubject(false);
        }
    };

    const handleAddTopic = () => {
        if (manualTopicName.trim() && currentSubject && onAddNewTopic) {
            const newTopicId = `new-${Date.now()}`;
            onAddNewTopic(manualTopicName, currentSubject);
            setAddedTopic({ id: newTopicId, name: manualTopicName });
            form.setValue('topic', manualTopicName, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
            setManualTopicName('');
            setShowAddTopic(false);
        }
    };

    // Modified SelectValue components to display the actual values
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Classification</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subject *</FormLabel>
                                <div className="space-y-2">
                                    {!showAddSubject ? (
                                        <>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    form.setValue('topic', '');
                                                    setAddedTopic(null); // Reset added topic when subject changes
                                                }}
                                                value={field.value}
                                                disabled={!!addedSubject}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue>
                                                            {addedSubject?.name ||
                                                                subjects.find((s) => s.id === field.value)?.name ||
                                                                'Select subject'}
                                                        </SelectValue>
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
                                            <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setShowAddSubject(true)}>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Add New Subject
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                value={manualSubjectName}
                                                onChange={(e) => setManualSubjectName(e.target.value)}
                                                placeholder="Enter new subject name"
                                            />
                                            <Button type="button" onClick={handleAddSubject}>
                                                Add
                                            </Button>
                                            <Button type="button" variant="ghost" onClick={() => setShowAddSubject(false)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Topic *</FormLabel>
                                <div className="space-y-2">
                                    {!showAddTopic ? (
                                        <>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!currentSubject || !!addedTopic}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue>
                                                            {addedTopic?.name ||
                                                                availableTopics.find((t) => t.id === field.value)?.name ||
                                                                'Select topic'}
                                                        </SelectValue>
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
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2"
                                                disabled={!currentSubject}
                                                onClick={() => setShowAddTopic(true)}
                                            >
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Add New Topic
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                value={manualTopicName}
                                                onChange={(e) => setManualTopicName(e.target.value)}
                                                placeholder="Enter new topic name"
                                            />
                                            <Button type="button" onClick={handleAddTopic}>
                                                Add
                                            </Button>
                                            <Button type="button" variant="ghost" onClick={() => setShowAddTopic(false)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>MCQ Language *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="ur">Urdu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2">
                    {/* add functionality to check currentaffair and general knowledge */}
                    <FormField
                        control={form.control}
                        name="current_affair"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            // setIsCurrentAffair(!!checked);
                                        }}
                                    />
                                </FormControl>
                                <FormLabel>Current Affairs *</FormLabel>
                            </FormItem>
                        )}
                    />
                    {/* add functionality to check currentaffair and general knowledge */}
                    <FormField
                        control={form.control}
                        name="general_knowledge"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            // setIsGeneralKnowledge(!!checked);
                                        }}
                                    />
                                </FormControl>
                                <FormLabel>General Knowledge *</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

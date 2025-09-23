import { Badge } from '../ui/badge';

interface OptionsComponentProps {
    optionEntries: [string, string][];
    mcqMode: boolean;
    question_type: 'multiple' | 'single' | 'true_false' | 'single_a' | undefined;
    disabled: boolean;
    selectedAnswers: string[];
    setSelectedAnswers: (answers: string[]) => void;
    setDisabled: (val: boolean) => void;
    setShowExplanation: (val: boolean) => void;
    correctAnswers: string[];
}

export default function OptionsComponent({
    question_type,
    optionEntries,
    mcqMode,
    disabled,
    selectedAnswers,
    setSelectedAnswers,
    correctAnswers,
    setDisabled,
    setShowExplanation,
}: OptionsComponentProps) {
    const isMultiple = question_type === 'multiple';
    const isSingle = ['single', 'true_false', 'single_a'].includes(question_type || '');
    const handleOptionSelect = (optKey: string): void => {
        if (!mcqMode || disabled) return;

        let newSelected: string[];
        if (isSingle) {
            newSelected = [optKey];
        } else {
            newSelected = selectedAnswers.includes(optKey) ? selectedAnswers.filter((a) => a !== optKey) : [...selectedAnswers, optKey];
        }

        setSelectedAnswers(newSelected);

        // lock logic
        if (isMultiple) {
            const allCorrect = correctAnswers.every((c) => newSelected.includes(c)) && newSelected.length === correctAnswers.length;
            const hasWrong = newSelected.some((o) => !correctAnswers.includes(o));

            if (allCorrect || hasWrong) {
                setDisabled(true);
                setShowExplanation(true);
            }
        }

        if (isSingle) {
            setDisabled(true);
            setShowExplanation(true);
        }
    };
    const getOptionClasses = (optKey: string): string => {
        const baseClasses = 'flex items-center space-x-3 rounded-md p-3 text-sm transition-all duration-200';
        const cursorClass = mcqMode && !disabled ? 'cursor-pointer' : 'cursor-not-allowed';

        const isCorrect = correctAnswers.includes(optKey);
        const isSelected = selectedAnswers.includes(optKey);

        // const allCorrect = correctAnswers.every((c) => selectedAnswers.includes(c)) && selectedAnswers.length === correctAnswers.length;

        if (mcqMode) {
            // --- multiple choice logic ---
            if (isMultiple) {
                if (!disabled) {
                    return `${baseClasses} ${cursorClass} bg-background hover:bg-accent border border-transparent`;
                }

                // locked state after wrong/all correct
                if (isSelected && isCorrect) {
                    return `${baseClasses} ${cursorClass} bg-green-50 border-2 border-green-200`;
                }
                if (disabled && isCorrect) {
                    return `${baseClasses} ${cursorClass} bg-green-50 border-2 border-green-200`;
                } else if (isSelected && !isCorrect) {
                    return `${baseClasses} ${cursorClass} bg-red-50 border-2 border-red-200`;
                } else {
                    return `${baseClasses} ${cursorClass} bg-gray-50 opacity-60 border border-transparent`;
                }
            }

            // --- single choice logic ---
            if (isSingle) {
                if (!disabled) {
                    return `${baseClasses} ${cursorClass} bg-background hover:bg-accent border border-transparent`;
                }

                if (isCorrect) {
                    return `${baseClasses} ${cursorClass} bg-green-50 border-2 border-green-200`;
                } else if (isSelected && !isCorrect) {
                    return `${baseClasses} ${cursorClass} bg-red-50 border-2 border-red-200`;
                } else {
                    return `${baseClasses} ${cursorClass} bg-gray-50 opacity-60 border border-transparent`;
                }
            }
        }

        // Study mode
        return isCorrect
            ? `${baseClasses} ${cursorClass} bg-green-50 border-2 border-green-200`
            : `${baseClasses} ${cursorClass} bg-gray-50 opacity-50 border border-transparent`;
    };

    // const hasWrong = selectedAnswers.some((o) => !correctAnswers.includes(o));

    return (
        <div className="mb-2 grid gap-2 sm:grid-cols-2 sm:gap-3 md:mb-4">
            {optionEntries.map(([key, value]) => (
                <div key={key} className={getOptionClasses(key)} onClick={() => handleOptionSelect(key)}>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white">
                        <span className="text-xs font-medium text-gray-600">{key}</span>
                    </div>
                    <span className="flex-1 font-semibold">{value}</span>

                    {/* Correct indicator */}
                    {((mcqMode && selectedAnswers.length > 0) || !mcqMode) && correctAnswers.includes(key) && selectedAnswers.includes(key) && (
                        <Badge variant="secondary" className="bg-green-100 text-xs text-green-700">
                            ✓ Correct
                        </Badge>
                    )}

                    {/* Wrong indicator */}
                    {mcqMode && selectedAnswers.includes(key) && !correctAnswers.includes(key) && (
                        <Badge variant="secondary" className="bg-red-100 text-xs text-red-700">
                            ✗ Wrong
                        </Badge>
                    )}
                </div>
            ))}
        </div>
    );
}

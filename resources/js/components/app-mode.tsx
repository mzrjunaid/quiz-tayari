import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';

interface Props {
    setMcqMode: (mode: boolean) => void;
    mcqMode: boolean;
    className?: string;
}

const modeButton = (appearance: string) => {
    const baseClass = 'h-5 w-5 cursor-pointer text-secondary-foreground hover:text-primary';

    switch (appearance) {
        case 'light':
            return <Moon className={baseClass} />;
        case 'dark':
            return <Sun className={baseClass} />;
        default:
            return <Monitor className={baseClass} />;
    }
};

export default function AppMode({ mcqMode, setMcqMode, className }: Props) {
    const { appearance, updateAppearance } = useAppearance();

    // toggle function
    const toggleMode = () => {
        if (appearance === 'light') updateAppearance('dark');
        else if (appearance === 'dark') updateAppearance('system');
        else updateAppearance('light');
    };

    const handleMcqToggle = (): void => {
        setMcqMode(!mcqMode);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Button variant="default" size="sm" onClick={handleMcqToggle}>
                {mcqMode ? 'Study Mode' : 'MCQ Mode'}
            </Button>
            <Button onClick={toggleMode} variant="link" size="icon" className='ms-2' asChild>
                {modeButton(appearance)}
            </Button>
        </div>
    );
}

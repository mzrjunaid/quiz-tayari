import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function AppMode() {
    const { appearance, updateAppearance } = useAppearance();

    // toggle function
    const toggleMode = () => {
        if (appearance === 'light') updateAppearance('dark');
        else if (appearance === 'dark') updateAppearance('system');
        else updateAppearance('light');
    };

    return (
        <Button onClick={toggleMode} variant="outline" size="icon">
            {appearance === 'light' && <Moon className="h-5 w-5" />}
            {appearance === 'dark' && <Sun className="h-5 w-5" />}
            {appearance === 'system' && <Monitor className="h-5 w-5" />}
        </Button>
    );
}

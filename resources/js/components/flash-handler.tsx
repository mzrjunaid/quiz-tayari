// resources/js/components/FlashHandler.tsx
import { useToast } from '@/hooks/use-toast';
import type { FlashMessages } from '@/types/toast';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';

interface FlashPageProps {
    flash: FlashMessages;
    [key: string]: any;
}

const FlashHandler: React.FC = () => {
    const { props } = usePage<FlashPageProps>();
    const { success, error, warning, info, message } = useToast();
    const processedFlash = useRef<string | null>(null);

    useEffect(() => {
        const flash = props.flash;

        if (!flash || Object.keys(flash).length === 0) return;

        // Create a unique key for this flash message set
        const flashKey = JSON.stringify(flash);

        // Avoid processing the same flash messages multiple times
        if (processedFlash.current === flashKey) return;

        processedFlash.current = flashKey;

        // Small delay to ensure the page has loaded
        const timer = setTimeout(() => {
            Object.entries(flash).forEach(([type, msg]) => {
                if (!msg) return;

                switch (type) {
                    case 'success':
                        success(msg);
                        break;
                    case 'error':
                        error(msg);
                        break;
                    case 'warning':
                        warning(msg);
                        break;
                    case 'info':
                        info(msg);
                        break;
                    case 'message':
                        message(msg);
                        break;
                    default:
                        message(msg);
                }
            });
        }, 100); // Small delay to ensure proper rendering

        return () => clearTimeout(timer);
    }, [props.flash, success, error, warning, info, message]);

    // Reset processed flash when navigating
    useEffect(() => {
        const handleInertiaStart = () => {
            processedFlash.current = null;
        };

        document.addEventListener('inertia:start', handleInertiaStart);

        return () => {
            document.removeEventListener('inertia:start', handleInertiaStart);
        };
    }, []);

    return null;
};

export default FlashHandler;

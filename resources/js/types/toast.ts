export interface ToastOptions {
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    cancel?: {
        label: string;
        onClick: () => void;
    };
    id?: string | number;
    dismissible?: boolean;
    onDismiss?: (toast: any) => void;
    onAutoClose?: (toast: any) => void;
    style?: Record<string, string>;
    className?: string;
    descriptionClassName?: string;
    actionButtonStyle?: Record<string, string>;
    cancelButtonStyle?: Record<string, string>;
}

// Updated: Sonner's promise messages interface
export interface PromiseMessages {
    loading?: string;
    success?: string | ((data: any) => string);
    error?: string | ((error: any) => string);
    description?: string;
    finally?: () => void;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
    message?: string;
}

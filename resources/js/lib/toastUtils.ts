import type { PromiseMessages, ToastOptions } from '@/types/toast';
import { toast } from 'sonner';

export const createToastUtils = () => {
    const success = (message: string, options: ToastOptions = {}) => {
        return toast.success(message, {
            duration: 4000,
            ...options,
        });
    };

    const error = (message: string, options: ToastOptions = {}) => {
        return toast.error(message, {
            duration: 4000,
            ...options,
        });
    };

    const warning = (message: string, options: ToastOptions = {}) => {
        return toast.warning(message, {
            duration: 4000,
            ...options,
        });
    };

    const info = (message: string, options: ToastOptions = {}) => {
        return toast.info(message, {
            duration: 4000,
            ...options,
        });
    };

    const message = (text: string, options: ToastOptions = {}) => {
        return toast(text, {
            duration: 4000,
            ...options,
        });
    };

    // Fix: Sonner's promise method takes only 2 arguments
    const promise = <T>(promise: Promise<T>, messages: PromiseMessages) => {
        return toast.promise(promise, messages);
    };

    const loading = (message: string, options: ToastOptions = {}) => {
        return toast.loading(message, options);
    };

    const dismiss = (toastId?: string | number) => {
        return toast.dismiss(toastId);
    };

    return {
        toast,
        success,
        error,
        warning,
        info,
        message,
        promise,
        loading,
        dismiss,
    };
};

export type UseToastReturn = ReturnType<typeof createToastUtils>;

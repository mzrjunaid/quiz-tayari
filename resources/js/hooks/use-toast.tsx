import { createToastUtils } from '@/lib/toastUtils';

export const useToast = () => {
    return createToastUtils();
};

export type UseToastReturn = ReturnType<typeof useToast>;

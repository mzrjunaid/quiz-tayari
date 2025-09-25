// import { useEffect, useState } from 'react';

import { router, usePage } from '@inertiajs/react';

// export function useMcqMode() {
//     const [mcqMode, setMcqMode] = useState<boolean>(() => {
//         if (typeof window !== 'undefined') {
//             const saved = localStorage.getItem('mcqMode'); // ✅ localStorage instead of sessionStorage
//             return saved ? JSON.parse(saved) : false;
//         }
//         return false;
//     });

//     // ✅ Persist whenever it changes
//     useEffect(() => {
//         localStorage.setItem('mcqMode', JSON.stringify(mcqMode));
//     }, [mcqMode]);

//     // ✅ Add a toggle helper so you don’t repeat logic
//     const toggleMcqMode = () => setMcqMode((prev) => !prev);

//     return { mcqMode, setMcqMode, toggleMcqMode };
// }

export function useMcqMode() {
    const { mcqMode } = usePage().props as unknown as { mcqMode: boolean };

    const setMcqMode = (value: boolean) => {
        router.post(
            '/set-mcq-mode',
            { mcqMode: value },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return { mcqMode, setMcqMode };
}

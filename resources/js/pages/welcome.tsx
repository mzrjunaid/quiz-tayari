// import AppLayout from '@/layouts/app-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { LinkPaginatedData, Mcqs } from '@/types';
import { useEffect, useState } from 'react';
import MCQHomepage from './Homepage/Homepage';

interface Props {
    mcqs: LinkPaginatedData<Mcqs>;
}

export default function Welcome({ mcqs }: Props) {
    // const { auth } = usePage<SharedData>().props;

    const [mcqMode, setMcqMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('mcqMode');
            return saved ? JSON.parse(saved) : false;
        }
        return false;
    });

    useEffect(() => {
        sessionStorage.setItem('mcqMode', JSON.stringify(mcqMode));
    }, [mcqMode]);

    return (
        <PublicLayout title="Hompage" mcqMode={mcqMode} setMcqMode={setMcqMode}>
            <MCQHomepage mcqMode={mcqMode} mcqs={mcqs} />
            {/* <div>Homepage</div> */}
        </PublicLayout>
    );
}

// import AppLayout from '@/layouts/app-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { LinkPaginatedData, Mcqs, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import MCQHomepage from './Public/Homepage';

interface Props {
    mcqs: LinkPaginatedData<Mcqs>;
}

export default function Welcome({ mcqs }: Props) {
    const { mcqMode } = usePage<SharedData>().props;

    return (
        <PublicLayout title="Hompage">
            <MCQHomepage mcqMode={mcqMode} mcqs={mcqs} />
        </PublicLayout>
    );
}

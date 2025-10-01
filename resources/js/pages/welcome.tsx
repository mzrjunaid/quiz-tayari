// import AppLayout from '@/layouts/app-layout';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { LinkPaginatedData, Mcqs } from '@/types';
import MCQHomepage from './Public/Homepage';

interface Props {
    mcqs: LinkPaginatedData<Mcqs>;
}

export default function Welcome({ mcqs }: Props) {
    return (
        <PublicLayout title="Hompage">
            <MCQHomepage mcqs={mcqs} />
        </PublicLayout>
    );
}

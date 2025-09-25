// import AppLayout from '@/layouts/app-layout';
import { useMcqMode } from '@/hooks/use-mcq-mode';
import { PublicLayout } from '@/layouts/frontend/public-layout';
import { LinkPaginatedData, Mcqs } from '@/types';
import MCQHomepage from './Public/Homepage';

interface Props {
    mcqs: LinkPaginatedData<Mcqs>;
}

export default function Welcome({ mcqs }: Props) {
    const { mcqMode } = useMcqMode();

    return (
        <PublicLayout title="Hompage">
            <MCQHomepage mcqMode={mcqMode} mcqs={mcqs} />
        </PublicLayout>
    );
}

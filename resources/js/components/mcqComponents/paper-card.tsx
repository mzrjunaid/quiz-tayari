import { OldPaper, Paper } from '@/types';
import { Link } from '@inertiajs/react';
import { Badge } from '../ui/badge';

interface Props {
    paper: Paper;
}

const PaperCard: React.FC<Props> = ({ paper }) => {
    return (
        <Link
            href={route('public.papers.show', paper.slug)}
            className="space-y-2 rounded-sm bg-card/45 px-5 py-4 hover:bg-accent/35 hover:shadow-xl hover:animate-out"
        >
            <div className="flex flex-row justify-between">
                <Badge variant="outline" title={paper.department}>
                    <span className="max-w-36 truncate">{paper.department}</span>
                </Badge>
                {paper.scheduled_at && <span className="text-sm font-semibold">{paper.scheduled_at.date_only}</span>}
            </div>
            <div className="py-2 text-sm font-semibold text-gray-950 capitalize">{paper.title.toLowerCase()}</div>
            <div className="flex flex-row justify-between">
                <Badge variant="default">{paper.subject}</Badge>
                <Badge variant="secondary">{paper.testing_service.short}</Badge>
            </div>
        </Link>
    );
};

export default PaperCard;

interface OldPaperProps {
    paper: OldPaper;
}
const OldPaperCard: React.FC<OldPaperProps> = ({ paper }) => {
    return (
        <Link
            href={route('public.old-papers.show', paper.slug)}
            className="space-y-2 rounded-sm bg-card/45 px-5 py-4 hover:bg-accent/35 hover:shadow-xl hover:animate-out"
        >
            <div className="flex flex-row justify-between">
                <Badge variant="outline" title={paper.department.department}>
                    <span className="max-w-36 truncate">{paper.department.department}</span>
                </Badge>
                {/* {<span className="text-sm font-semibold">{paper.paper_year}</span>} */}
            </div>
            <div className="py-2 text-sm font-semibold text-gray-950 capitalize">{paper.paper.toLowerCase()}</div>
            <div className="flex flex-row justify-between">
                <Badge variant="default">{paper.paper_year}</Badge>
                <Badge variant="secondary">{paper.testing_service.testing_service}</Badge>
            </div>
        </Link>
    );
};

export { OldPaperCard };

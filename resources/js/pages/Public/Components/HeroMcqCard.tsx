import McqCard from '@/components/mcqComponents/SingleMcq';
import { useIsMobile } from '@/hooks/use-mobile';

interface MCQ {
    id: string | number;
    question: string;
    options: string[];
    correctAnswer: number;
    subject: string;
    difficulty: string;
    views: number;
    aiEnhanced: boolean;
    tags: string[];
    explanation?: string;
    testService: string;
}

interface Props {
    sampleMCQs: MCQ[];
    currentMCQ: number;
    mcqMode: boolean;
}

export default function HeroMcqPreview({ sampleMCQs, currentMCQ, mcqMode }: Props) {
    const isMobile = useIsMobile();
    {
        /* Live MCQ Preview */
    }
    return (
        !isMobile && (
            <div className="relative">
                <McqCard mcq={sampleMCQs[currentMCQ]} mcqMode={mcqMode} index={currentMCQ} key={currentMCQ} />
            </div>
        )
    );
}

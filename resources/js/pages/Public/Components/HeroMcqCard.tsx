import McqCard from '@/components/mcqComponents/SingleMcq';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mcqs } from '@/types';

// interface MCQ {
//     id: string | number;
//     question: string;
//     options: string[];
//     correctAnswer: number;
//     subject: string;
//     difficulty: string;
//     views: number;
//     aiEnhanced: boolean;
//     tags: string[];
//     explanation?: string;
//     testService: string;
// }

interface Props {
    sampleMCQs: Mcqs[];
    currentMCQ: number;
}

export default function HeroMcqPreview({ sampleMCQs, currentMCQ }: Props) {
    const isMobile = useIsMobile();
    {
        /* Live MCQ Preview */
    }
    return (
        !isMobile && (
            <div className="relative">
                <McqCard mcq={sampleMCQs[currentMCQ]} index={currentMCQ} key={currentMCQ} />
            </div>
        )
    );
}

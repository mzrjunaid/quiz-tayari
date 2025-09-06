import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function ButtonTooltip({ text, children }: { text: string; children: ReactNode }) {
    return (
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    );
}

import type { FC, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

export type HistorySize = 'default' | 'lg';

// --poster-h mirrors DEFAULT_CONTAINER_RATIO: the timeline line runs from one tile to the next, both centred on their posters.
export const historyRowsVariants = cva(
    'flex flex-col gap-(--row-gap) [--poster-h:calc(var(--poster-w)/0.7)] [--poster-w:3rem] [--row-gap:1.5rem]',
    {
        variants: {
            size: {
                default: '',
                lg: 'md:[--poster-w:3.5rem] md:[--row-gap:1.25rem]',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

type Props = {
    node: ReactNode;
    poster: ReactNode;
    children: ReactNode;
};

const HistoryRow: FC<Props> = ({ node, poster, children }) => (
    <div className="relative flex items-start gap-4 not-last:before:absolute not-last:before:top-[calc(var(--poster-h)/2+1rem)] not-last:before:bottom-[calc(-1*(var(--row-gap)+var(--poster-h)/2-1rem))] not-last:before:left-[15px] not-last:before:w-0.5 not-last:before:bg-border not-last:before:content-['']">
        <div className="flex shrink-0 items-center gap-3">
            {node}
            <div className="w-(--poster-w) shrink-0">{poster}</div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 self-stretch">
            {children}
        </div>
    </div>
);

export default HistoryRow;

import { type FC, Fragment } from 'react';

import { cn } from '@/utils/cn';

import type { MetaPart } from '../franchise-model';

type Props = {
    parts: MetaPart[];
    className?: string;
};

const FranchiseMeta: FC<Props> = ({ parts, className }) => (
    <span
        className={cn(
            'flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap font-medium text-muted-foreground text-xs leading-4',
            className,
        )}
    >
        {parts.map((part, index) => (
            <Fragment key={part.text}>
                {index > 0 && (
                    <span className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                )}
                <span className={cn('truncate', part.className)}>
                    {part.text}
                </span>
            </Fragment>
        ))}
    </span>
);

export default FranchiseMeta;

import type { FC } from 'react';

import { cn } from '@/utils/cn';

const VISIBLE_WITHIN = 200;

type Props = {
    length: number;
    max: number;
    className?: string;
};

const CharacterCounter: FC<Props> = ({ length, max, className }) => {
    if (length < max - VISIBLE_WITHIN) return null;

    return (
        <span
            className={cn(
                'text-muted-foreground text-xs tabular-nums',
                length > max && 'text-destructive',
                className,
            )}
        >
            {length}/{max}
        </span>
    );
};

export default CharacterCounter;

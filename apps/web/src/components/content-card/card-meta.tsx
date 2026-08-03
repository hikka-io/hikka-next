import type { FC } from 'react';

import { cn } from '@/utils/cn';

type Props = {
    title?: string | null;
    description?: string | null;
    leftSubtitle?: string | null;
    rightSubtitle?: string | null;
    titleClassName?: string;
};

const CardMeta: FC<Props> = ({
    title,
    description,
    leftSubtitle,
    rightSubtitle,
    titleClassName,
}) => {
    const hasSubtitles = Boolean(leftSubtitle || rightSubtitle);

    return (
        <>
            {description && (
                <p className="mb-1 truncate text-muted-foreground text-xs">
                    {description}
                </p>
            )}
            {title && (
                <span
                    className={cn(
                        'font-medium text-sm leading-5',
                        !hasSubtitles && 'line-clamp-2',
                        titleClassName,
                    )}
                >
                    {title}
                </span>
            )}
            {hasSubtitles && (
                <div className="mt-1 flex items-center gap-2">
                    {leftSubtitle && (
                        <span className="font-medium text-muted-foreground text-xs leading-tight">
                            {leftSubtitle}
                        </span>
                    )}
                    {leftSubtitle && rightSubtitle && (
                        <div className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                    )}
                    {rightSubtitle && (
                        <span className="font-medium text-muted-foreground text-xs leading-tight">
                            {rightSubtitle}
                        </span>
                    )}
                </div>
            )}
        </>
    );
};

export default CardMeta;

import type { FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

type Props = {
    total?: number;
    isLoading: boolean;
    className?: string;
};

const TodoListSummary: FC<Props> = ({ total, isLoading, className }) => {
    return (
        <div
            className={cn(
                'flex min-h-6 flex-wrap items-center gap-x-4 gap-y-2',
                className,
            )}
        >
            <div className="shrink-0 text-muted-foreground text-sm">
                {isLoading ? (
                    <Skeleton className="h-4 w-40 rounded" />
                ) : (
                    <>
                        Знайдено{' '}
                        <span className="font-semibold text-foreground">
                            {(total ?? 0).toLocaleString('uk-UA')}
                        </span>{' '}
                        результатів
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoListSummary;

import { FC, ReactNode } from 'react';

import { TableHead } from '@/components/ui/table';

import { cn } from '@/utils/cn';

interface Props {
    children: ReactNode;
    active: boolean;
    order: 'asc' | 'desc' | null;
    onSort: () => void;
    className?: string;
}

const SortableHead: FC<Props> = ({
    children,
    active,
    order,
    onSort,
    className,
}) => {
    return (
        <TableHead
            align="center"
            aria-sort={
                active ? (order === 'asc' ? 'ascending' : 'descending') : 'none'
            }
            className={cn(
                'text-center select-none',
                active && 'text-primary-foreground',
                className,
            )}
        >
            <button
                type="button"
                onClick={onSort}
                className="mx-auto flex cursor-pointer items-center gap-1 font-bold hover:underline"
            >
                {children}
            </button>
        </TableHead>
    );
};

export default SortableHead;

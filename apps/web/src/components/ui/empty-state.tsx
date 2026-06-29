import type { ReactNode } from 'react';

import MaterialSymbolsFeatureSearch from '@/components/icons/material-symbols/MaterialSymbolsFeatureSearch';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/utils/cn';

type EmptyStateSize = 'sm' | 'md' | 'lg';

type Props = {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    size?: EmptyStateSize;
    bordered?: boolean;
    className?: string;
};

const ROOT_SIZE: Record<EmptyStateSize, string> = {
    sm: 'gap-3 p-4 md:p-4',
    md: 'gap-4 p-6 md:p-8',
    lg: 'gap-5 p-8 md:p-12',
};

const HEADER_SIZE: Record<EmptyStateSize, string> = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2',
};

const CHIP_SIZE: Record<EmptyStateSize, string> = {
    sm: "size-9 [&_svg:not([class*='size-'])]:size-5",
    md: "size-10 [&_svg:not([class*='size-'])]:size-6",
    lg: "size-12 [&_svg:not([class*='size-'])]:size-7",
};

const TITLE_SIZE: Record<EmptyStateSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
};

const DESC_SIZE: Record<EmptyStateSize, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
};

const EmptyState = ({
    title,
    description,
    icon,
    action,
    size = 'md',
    bordered = false,
    className,
}: Props) => {
    return (
        <Empty
            className={cn(
                ROOT_SIZE[size],
                bordered && 'border bg-secondary/20',
                className,
            )}
        >
            <EmptyHeader className={HEADER_SIZE[size]}>
                <EmptyMedia variant="icon" className={CHIP_SIZE[size]}>
                    {icon ?? <MaterialSymbolsFeatureSearch />}
                </EmptyMedia>
                <EmptyTitle className={TITLE_SIZE[size]}>{title}</EmptyTitle>
                {description && (
                    <EmptyDescription className={DESC_SIZE[size]}>
                        {description}
                    </EmptyDescription>
                )}
            </EmptyHeader>
            {action && <EmptyContent>{action}</EmptyContent>}
        </Empty>
    );
};

export default EmptyState;

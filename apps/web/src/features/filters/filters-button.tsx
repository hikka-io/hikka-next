import { type FC, type ReactNode, useState } from 'react';

import { Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { useActiveFilters } from './active-filters';

export type RenderFiltersModal = (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => ReactNode;

type Props = {
    renderModal: RenderFiltersModal;
    variant?: ButtonProps['variant'];
    className?: string;
    badgeClassName?: string;
    /** Badge count for panels whose params the shared filter registry doesn't know. */
    count?: number;
};

const FiltersButton: FC<Props> = ({
    renderModal,
    variant = 'outline',
    className,
    badgeClassName,
    count: countOverride,
}) => {
    const [open, setOpen] = useState(false);
    const { count: activeCount } = useActiveFilters();
    const count = countOverride ?? activeCount;

    return (
        <>
            <Button
                variant={variant}
                size="icon-md"
                onClick={() => setOpen(true)}
                className={cn('relative shrink-0 overflow-visible', className)}
                aria-label="Фільтри"
            >
                <Filter />
                {count > 0 && (
                    <Badge
                        variant="default"
                        className={cn(
                            'absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]',
                            badgeClassName,
                        )}
                    >
                        {count}
                    </Badge>
                )}
            </Button>
            {renderModal({ open, onOpenChange: setOpen })}
        </>
    );
};

export const HeaderFiltersButton: FC<{ renderModal: RenderFiltersModal }> = ({
    renderModal,
}) => (
    <FiltersButton
        variant="ghost"
        className="text-muted-foreground [&_svg]:size-5"
        badgeClassName="top-0 right-0"
        renderModal={renderModal}
    />
);

export default FiltersButton;

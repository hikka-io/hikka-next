import { type FC, type ReactNode, useState } from 'react';

import { Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { useActiveFilters } from './active-filters';

export type RenderFiltersModal = (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preserve?: readonly string[];
}) => ReactNode;

type Props = {
    renderModal: RenderFiltersModal;
    variant?: ButtonProps['variant'];
    className?: string;
    badgeClassName?: string;
    /** Params that select the list itself (chips above it): left out of the count and kept by the modal's clear button. */
    preserve?: readonly string[];
};

const FiltersButton: FC<Props> = ({
    renderModal,
    variant = 'outline',
    className,
    badgeClassName,
    preserve = [],
}) => {
    const [open, setOpen] = useState(false);
    const { filters } = useActiveFilters();
    const count = filters.filter(
        (filter) => !preserve.includes(filter.param),
    ).length;

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
            {renderModal({ open, onOpenChange: setOpen, preserve })}
        </>
    );
};

export const HeaderFiltersButton: FC<
    Pick<Props, 'renderModal' | 'preserve'>
> = ({ renderModal, preserve }) => (
    <FiltersButton
        variant="ghost"
        className="text-muted-foreground [&_svg]:size-5"
        badgeClassName="top-0 right-0"
        renderModal={renderModal}
        preserve={preserve}
    />
);

export default FiltersButton;

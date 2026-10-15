import type { FC } from 'react';

import { useSortable } from '@dnd-kit/react/sortable';

import type { UserLink } from '@hikka/api';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import { USER_LINK_ICONS } from '@/components/icons/user-link-icons';
import { Button } from '@/components/ui/button';
import { getUserLinkDisplayUrl, getUserLinkLabel } from '@/utils/user-links';

type Props = {
    id: string;
    index: number;
    count: number;
    link: UserLink;
    onEdit: () => void;
    onRemove: () => void;
    onMove: (to: number) => void;
};

const ProfileLinkRow: FC<Props> = ({
    id,
    index,
    count,
    link,
    onEdit,
    onRemove,
    onMove,
}) => {
    const { ref, handleRef } = useSortable({ id, index });
    const Icon = USER_LINK_ICONS[link.icon];
    const label = getUserLinkLabel(link);

    return (
        <div
            ref={ref}
            className="flex items-center gap-1 rounded-lg border bg-card p-1"
        >
            <Button
                ref={handleRef}
                size="icon-md"
                variant="ghost"
                className="cursor-grab touch-none text-muted-foreground"
                aria-label={`Перетягнути «${label}»`}
            >
                <MaterialSymbolsDragIndicator />
            </Button>
            <button
                type="button"
                onClick={onEdit}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary [&_svg]:size-4">
                    <Icon />
                </span>
                <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-sm">
                        {label}
                    </span>
                    <span className="truncate text-muted-foreground text-xs">
                        {getUserLinkDisplayUrl(link.url)}
                    </span>
                </span>
            </button>
            <Button
                size="icon-md"
                variant="ghost"
                disabled={index === 0}
                onClick={() => onMove(index - 1)}
                aria-label="Перемістити вище"
            >
                <MaterialSymbolsKeyboardArrowDownRounded className="rotate-180" />
            </Button>
            <Button
                size="icon-md"
                variant="ghost"
                disabled={index === count - 1}
                onClick={() => onMove(index + 1)}
                aria-label="Перемістити нижче"
            >
                <MaterialSymbolsKeyboardArrowDownRounded />
            </Button>
            <Button
                size="icon-md"
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={onEdit}
                aria-label="Редагувати"
            >
                <MaterialSymbolsEditRounded />
            </Button>
            <Button
                size="icon-md"
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={onRemove}
                aria-label="Видалити"
            >
                <MaterialSymbolsDeleteForever />
            </Button>
        </div>
    );
};

export default ProfileLinkRow;

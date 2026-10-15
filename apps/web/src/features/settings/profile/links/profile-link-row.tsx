import type { FC } from 'react';

import { useSortable } from '@dnd-kit/react/sortable';

import type { UserLink } from '@hikka/api';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import { Button } from '@/components/ui/button';
import UserLinkSummary from '@/components/user-link-summary';
import { getUserLinkLabel } from '@/utils/user-links';

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
    const label = getUserLinkLabel(link);

    return (
        <div
            ref={ref}
            className="surface flex items-center gap-2 rounded-lg border border-border p-2"
        >
            <Button
                ref={handleRef}
                size="icon-sm"
                variant="outline"
                className="cursor-grab touch-none"
                aria-label={`Перетягнути «${label}»`}
            >
                <MaterialSymbolsDragIndicator />
            </Button>
            <button
                type="button"
                onClick={onEdit}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                <UserLinkSummary link={link} />
            </button>
            <Button
                size="icon-sm"
                variant="outline"
                disabled={index === 0}
                onClick={() => onMove(index - 1)}
                aria-label="Перемістити вище"
            >
                <MaterialSymbolsKeyboardArrowDownRounded className="rotate-180" />
            </Button>
            <Button
                size="icon-sm"
                variant="outline"
                disabled={index === count - 1}
                onClick={() => onMove(index + 1)}
                aria-label="Перемістити нижче"
            >
                <MaterialSymbolsKeyboardArrowDownRounded />
            </Button>
            <Button
                size="icon-sm"
                variant="outline"
                className="hidden md:inline-flex"
                onClick={onEdit}
                aria-label="Редагувати"
            >
                <MaterialSymbolsEditRounded />
            </Button>
            <Button
                size="icon-sm"
                variant="outline"
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

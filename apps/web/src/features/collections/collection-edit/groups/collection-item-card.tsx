import { type FC, type MouseEvent, memo } from 'react';

import { pointerIntersection } from '@dnd-kit/collision';
import { useSortable } from '@dnd-kit/react/sortable';
import { Info } from 'lucide-react';

import PosterCard from '@/components/content-card/poster-card';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { Button } from '@/components/ui/button';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import { useCollectionContext } from '../collection-provider';
import { isCommentTooShort } from '../collection-rules';
import type { Item } from '../collection-store';
import { DRAG_HANDLE_ATTRIBUTE } from './card-moves';

type Props = {
    item: Item;
    index: number;
    groupId: string;
};

/** Keeps a control's click from also reaching the card, which opens the title's settings. */
const own = (action?: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    action?.();
};

const CollectionItemCard: FC<Props> = ({ item, index, groupId }) => {
    const { ref, isDragSource } = useSortable({
        id: String(item.id),
        index,
        group: groupId,
        collisionDetector: pointerIntersection,
    });
    const title = useTitle(item.content);
    const openItem = useCollectionContext((state) => state.openItem);
    const removeItem = useCollectionContext((state) => state.removeItem);
    const open = () => openItem(item.id);

    return (
        <PosterCard
            ref={ref}
            image={item.content.image}
            title={title}
            onClick={open}
            className={cn(isDragSource && 'opacity-30')}
            overlay={
                <>
                    <div className="surface-glass absolute top-2 right-2 z-1 flex gap-0.5 rounded-lg border p-0.5 opacity-0 pointer-coarse:opacity-100 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Перетягнути"
                            className="cursor-grab touch-none text-muted-foreground"
                            onClick={own()}
                            {...{ [DRAG_HANDLE_ATTRIBUTE]: '' }}
                        >
                            <MaterialSymbolsDragIndicator />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Коментар і група"
                            onClick={own(open)}
                        >
                            <MaterialSymbolsAddCommentRounded />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Прибрати з колекції"
                            onClick={own(() => removeItem(groupId, item.id))}
                        >
                            <MaterialSymbolsCloseRounded />
                        </Button>
                    </div>
                    {item.comment && (
                        <button
                            type="button"
                            aria-label="Коментар"
                            onClick={own(open)}
                            className={cn(
                                'absolute right-2 bottom-2 z-1 flex size-7 items-center justify-center rounded-md bg-secondary/80 backdrop-blur transition-colors hover:bg-accent',
                                isCommentTooShort(item.comment) &&
                                    'text-destructive-foreground',
                            )}
                        >
                            <Info className="size-4" />
                        </button>
                    )}
                </>
            }
        />
    );
};

export default memo(CollectionItemCard);

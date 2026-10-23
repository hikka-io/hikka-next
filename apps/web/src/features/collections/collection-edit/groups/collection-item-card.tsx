import { type FC, type MouseEvent, memo } from 'react';

import { pointerIntersection } from '@dnd-kit/collision';
import { useSortable } from '@dnd-kit/react/sortable';

import PosterCard from '@/components/content-card/poster-card';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsCloseRounded from '@/components/icons/material-symbols/MaterialSymbolsCloseRounded';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import CardOverlayPill from '../../card-overlay-pill';
import CollectionCommentPill from '../../collection-comment-pill';
import { useCollectionContext } from '../collection-provider';
import { isCommentTooShort } from '../collection-rules';
import type { Item } from '../collection-store';
import { DRAG_HANDLE_ATTRIBUTE, ITEM_DRAG_TYPE } from './card-moves';
import HintButton from './hint-button';

type Props = {
    item: Item;
    index: number;
    groupId: string;
};

/** Keeps a control's click from also reaching the card, which opens the item's settings. */
const own = (action?: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    action?.();
};

const CollectionItemCard: FC<Props> = ({ item, index, groupId }) => {
    const { ref, isDragSource } = useSortable({
        id: String(item.id),
        index,
        group: groupId,
        type: ITEM_DRAG_TYPE,
        accept: ITEM_DRAG_TYPE,
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
                    <CardOverlayPill className="absolute top-2 right-2 z-1 flex gap-0.5 opacity-0 pointer-coarse:opacity-100 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                        <HintButton
                            hint="Перетягніть, щоб змінити порядок"
                            className="cursor-grab touch-none text-muted-foreground"
                            onClick={own()}
                            {...{ [DRAG_HANDLE_ATTRIBUTE]: '' }}
                        >
                            <MaterialSymbolsDragIndicator />
                        </HintButton>
                        <HintButton hint="Коментар і група" onClick={own(open)}>
                            <MaterialSymbolsAddCommentRounded />
                        </HintButton>
                        <HintButton
                            hint="Прибрати з колекції"
                            onClick={own(() => removeItem(groupId, item.id))}
                        >
                            <MaterialSymbolsCloseRounded />
                        </HintButton>
                    </CardOverlayPill>
                    {item.comment && (
                        <CollectionCommentPill
                            comment={item.comment}
                            warning={isCommentTooShort(item.comment)}
                            onClick={own(open)}
                            className="absolute right-2 bottom-2 z-1"
                        />
                    )}
                </>
            }
        />
    );
};

export default memo(CollectionItemCard);

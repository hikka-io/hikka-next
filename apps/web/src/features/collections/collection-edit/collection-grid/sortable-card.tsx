import { type FC, memo, useState } from 'react';

import { pointerIntersection } from '@dnd-kit/collision';
import { useSortable } from '@dnd-kit/react/sortable';
import { Check, Trash2, X } from 'lucide-react';

import { DEFAULT_CONTAINER_RATIO } from '@/components/content-card/image-presets';
import PosterCard from '@/components/content-card/poster-card';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { Textarea } from '@/components/ui/textarea';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import type { Item } from '../collection-store';

type Props = {
    id: string;
    index: number;
    groupId: string;
    content: Item['content'];
    comment?: string;
    onRemove: (groupId: string, itemId: string | number) => void;
    onCommentChange?: (
        groupId: string,
        itemId: string | number,
        comment: string,
    ) => void;
};

const ASPECT_RATIO = String(DEFAULT_CONTAINER_RATIO);

const SortableCardContent = memo<{
    id: string;
    groupId: string;
    content: Item['content'];
    comment?: string;
    onRemove: (groupId: string, itemId: string | number) => void;
    onCommentChange?: (
        groupId: string,
        itemId: string | number,
        comment: string,
    ) => void;
}>(({ id, groupId, content, comment, onRemove, onCommentChange }) => {
    const title = useTitle(content);
    const [commentOpen, setCommentOpen] = useState(false);
    const [draft, setDraft] = useState('');

    const handleOpen = () => {
        setDraft(comment ?? '');
        setCommentOpen(true);
    };

    const handleSave = () => {
        onCommentChange?.(groupId, id, draft);
        setCommentOpen(false);
    };

    const handleDiscard = () => {
        onCommentChange?.(groupId, id, '');
        setCommentOpen(false);
    };

    return (
        <>
            <PosterCard image={content.image} title={title} />

            <div
                className="pointer-events-none absolute top-0 left-0 w-full"
                style={{ aspectRatio: ASPECT_RATIO }}
            >
                <div className="pointer-events-auto absolute right-2 bottom-2 z-1 flex gap-2">
                    <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={handleOpen}
                        className={cn(
                            comment &&
                                'border-primary-border bg-primary text-primary-foreground',
                        )}
                    >
                        <MaterialSymbolsAddCommentRounded />
                    </Button>
                    <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => onRemove(groupId, id)}
                    >
                        <MaterialSymbolsDeleteForever />
                    </Button>
                    {/* Spacer for drag handle (rendered in parent wrapper) */}
                    <div className="h-8 w-8" />
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-16 w-full rounded-b-md bg-linear-to-t from-background to-transparent" />
            </div>

            {commentOpen && (
                <ResponsiveModal
                    mobile="page"
                    open={commentOpen}
                    onOpenChange={(open) => {
                        if (!open) setCommentOpen(false);
                    }}
                >
                    <ResponsiveModalContent
                        className="md:max-w-xl"
                        title={title || 'Коментар'}
                    >
                        <div className="flex w-full flex-col gap-2">
                            <Label>Коментар</Label>
                            <Textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder="Додати коментар до елементу..."
                                className="min-h-20 w-full"
                            />
                        </div>
                        <ResponsiveModalFooter className="flex-row">
                            {comment && (
                                <Button
                                    variant="destructive"
                                    size="icon-md"
                                    aria-label="Видалити коментар"
                                    onClick={handleDiscard}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="md"
                                className="flex-1 md:flex-none"
                                onClick={() => setCommentOpen(false)}
                            >
                                <X className="size-4" />
                                Скасувати
                            </Button>
                            <Button
                                size="md"
                                className="flex-1 md:flex-none"
                                onClick={handleSave}
                            >
                                <Check className="size-4" />
                                Зберегти
                            </Button>
                        </ResponsiveModalFooter>
                    </ResponsiveModalContent>
                </ResponsiveModal>
            )}
        </>
    );
});

SortableCardContent.displayName = 'SortableCardContent';

const SortableCard: FC<Props> = ({
    id,
    index,
    groupId,
    content,
    comment,
    onRemove,
    onCommentChange,
}) => {
    const { ref, handleRef, isDragSource } = useSortable({
        id,
        index,
        group: groupId,
        collisionDetector: pointerIntersection,
    });

    return (
        <div ref={ref} className={cn('relative', isDragSource && 'opacity-30')}>
            <SortableCardContent
                id={id}
                groupId={groupId}
                content={content}
                comment={comment}
                onRemove={onRemove}
                onCommentChange={onCommentChange}
            />

            <div
                className="pointer-events-none absolute top-0 left-0 w-full"
                style={{ aspectRatio: ASPECT_RATIO }}
            >
                <div className="pointer-events-auto absolute right-2 bottom-2 z-2">
                    <Button ref={handleRef} size="icon-sm" variant="secondary">
                        <MaterialSymbolsDragIndicator />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SortableCard;

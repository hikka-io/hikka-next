'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CollectionContent } from '@hikka/client';
import { FC, memo, useState } from 'react';

import ContentCard, {
    DEFAULT_CONTAINER_RATIO,
} from '@/components/content-card/content-card';
import MaterialSymbolsAddCommentRounded from '@/components/icons/material-symbols/MaterialSymbolsAddCommentRounded';
import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '@/components/ui/responsive-modal';
import { Textarea } from '@/components/ui/textarea';

import { cn } from '@/utils/cn';

interface Props {
    id: string;
    groupId: string | number;
    content: CollectionContent & { title?: string };
    comment?: string;
    onRemove: (groupId: string | number, itemId: string | number) => void;
    onCommentChange?: (
        groupId: string | number,
        itemId: string | number,
        comment: string,
    ) => void;
}

const ASPECT_RATIO = String(DEFAULT_CONTAINER_RATIO);

const SortableCardContent = memo<{
    id: string;
    groupId: string | number;
    content: CollectionContent & { title?: string };
    comment?: string;
    onRemove: (groupId: string | number, itemId: string | number) => void;
    onCommentChange?: (
        groupId: string | number,
        itemId: string | number,
        comment: string,
    ) => void;
}>(({ id, groupId, content, comment, onRemove, onCommentChange }) => {
    const [commentOpen, setCommentOpen] = useState(false);

    return (
        <>
            <ContentCard image={content.image} title={content.title} />

            <div
                className="pointer-events-none absolute top-0 left-0 w-full"
                style={{ aspectRatio: ASPECT_RATIO }}
            >
                <div className="pointer-events-auto absolute right-2 bottom-2 z-1 flex gap-2">
                    <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => setCommentOpen(true)}
                        className={cn(comment && 'text-primary')}
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
                    <div className="h-8 w-8" />
                </div>
                <div className="from-background pointer-events-none absolute bottom-0 left-0 z-0 h-16 w-full rounded-b-md bg-linear-to-t to-transparent" />
            </div>

            {commentOpen && (
                <ResponsiveModal
                    open={commentOpen}
                    onOpenChange={setCommentOpen}
                >
                    <ResponsiveModalContent className="max-w-lg">
                        <ResponsiveModalHeader>
                            <ResponsiveModalTitle>
                                {content.title || 'Коментар'}
                            </ResponsiveModalTitle>
                        </ResponsiveModalHeader>
                        <div className="flex w-full flex-col gap-2">
                            <Label>Коментар</Label>
                            <Textarea
                                value={comment ?? ''}
                                onChange={(e) =>
                                    onCommentChange?.(
                                        groupId,
                                        id,
                                        e.target.value,
                                    )
                                }
                                placeholder="Додати коментар до елементу..."
                                className="min-h-[80px] w-full"
                            />
                        </div>
                    </ResponsiveModalContent>
                </ResponsiveModal>
            )}
        </>
    );
});

SortableCardContent.displayName = 'SortableCardContent';

const SortableCard: FC<Props> = ({
    id,
    groupId,
    content,
    comment,
    onRemove,
    onCommentChange,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, data: { groupId } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={{ ...style, opacity: isDragging ? 0.3 : 1 }}
            className="relative"
            {...attributes}
        >
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
                    <Button size="icon-sm" variant="secondary" {...listeners}>
                        <MaterialSymbolsDragIndicator />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SortableCard;

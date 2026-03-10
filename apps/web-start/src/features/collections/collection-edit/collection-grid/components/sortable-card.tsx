'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CollectionContent } from '@hikka/client';
import { FC, memo, useMemo } from 'react';

import ContentCard from '@/components/content-card/content-card';
import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { Button } from '@/components/ui/button';

interface Props {
    id: string;
    content: CollectionContent & { title?: string };
    onRemove: () => void;
}

const SortableCard: FC<Props> = ({ id, content, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {useMemo(
                () => (
                    <ContentCard image={content.image} title={content.title}>
                        <div className="absolute bottom-0 left-0 w-full">
                            <div className="absolute bottom-2 right-2 z-[1] flex gap-2">
                                <Button
                                    size="icon-sm"
                                    variant="secondary"
                                    onClick={onRemove}
                                >
                                    <MaterialSymbolsDeleteForever />
                                </Button>
                                <Button
                                    size="icon-sm"
                                    variant="secondary"
                                    {...listeners}
                                >
                                    <MaterialSymbolsDragIndicator />
                                </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 z-0 h-16 w-full bg-gradient-to-t from-background to-transparent" />
                        </div>
                    </ContentCard>
                ),
                [content, onRemove],
            )}
        </div>
    );
};

export default memo(SortableCard);

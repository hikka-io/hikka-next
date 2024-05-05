import React, { FC, memo, useMemo } from 'react';
import MaterialSymbolsDeleteForever from '~icons/material-symbols/delete-forever';
import MaterialSymbolsDragIndicator from '~icons/material-symbols/drag-indicator';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ContentCard from '@/components/content-card/content-card';
import { Button } from '@/components/ui/button';

interface Props {
    id: string;
    content: API.Anime | API.Character | API.Person;
    onRemove: () => void;
}

const SortableCard: FC<Props> = ({ id, content, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const poster = 'poster' in content ? content.poster : content.image;
    const title =
        'title_ua' in content
            ? content.title_ua || content.title_en || content.title_ja
            : content.name_ua || content.name_en;

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {useMemo(
                () => (
                    <ContentCard poster={poster} title={title}>
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
                            <div className="absolute bottom-0 left-0 z-0 h-16 w-full bg-gradient-to-t from-black to-transparent" />
                        </div>
                    </ContentCard>
                ),
                [content],
            )}
        </div>
    );
};

export default memo(SortableCard);

import type { FC } from 'react';

import type { CollectionResponse } from '@hikka/api';
import { getTitle } from '@hikka/core';

import { contentEntity } from '@/components/content-card';
import EntityCard from '@/components/content-card/entity-card';
import MorePosterCard from '@/components/content-card/more-poster-card';
import Stack, { type StackSize } from '@/components/ui/stack';
import { useSessionUI } from '@/services/session';
import { cn } from '@/utils/cn';

import {
    STRIP_CONTAINER_CLASS_NAME,
    STRIP_GRID_CLASS_NAME,
    STRIP_META_CLASS_NAME,
    STRIP_POSTER_CLASS_NAMES,
    STRIP_PREVIEW_ITEMS,
    STRIP_TILE_LAYOUTS,
} from './collection-strip';

type Props = {
    collection: CollectionResponse;
    className?: string;
};

const CollectionPreviewStrip: FC<Props> = ({ collection, className }) => {
    const { preferences } = useSessionUI();
    const previewItems = collection.collection.slice(0, STRIP_PREVIEW_ITEMS);
    // The first entry no layout shows as a poster; a short list previews its last, hidden wherever the tile shows.
    const tilePreview =
        collection.collection[STRIP_PREVIEW_ITEMS] ??
        (collection.entries <= STRIP_PREVIEW_ITEMS
            ? collection.collection.at(-1)
            : undefined);

    return (
        <div className={cn(STRIP_CONTAINER_CLASS_NAME, className)}>
            <Stack
                size={(STRIP_PREVIEW_ITEMS + 1) as StackSize}
                gap="md"
                imagePreset="cardSm"
                className={STRIP_GRID_CLASS_NAME}
            >
                {previewItems.map((item, index) => (
                    <div
                        key={item.content.slug}
                        className={STRIP_POSTER_CLASS_NAMES[index]}
                    >
                        <EntityCard
                            entity={contentEntity(item.content)}
                            title={getTitle(
                                item.content,
                                preferences.title_language,
                                preferences.name_language,
                            )}
                            metaClassName={STRIP_META_CLASS_NAME}
                            titleBlur={collection.spoiler}
                            imageBlur={collection.nsfw || collection.spoiler}
                        />
                    </div>
                ))}
                {collection.entries > 2 && (
                    <MorePosterCard
                        className={cn(
                            STRIP_TILE_LAYOUTS.filter(
                                ({ shown }) => collection.entries <= shown,
                            ).map(({ hiddenClassName }) => hiddenClassName),
                        )}
                        to={`/collections/${collection.reference}`}
                        image={tilePreview?.content.image}
                        blurred={collection.nsfw || collection.spoiler}
                        total={collection.entries}
                        contentType={collection.content_type}
                    />
                )}
            </Stack>
        </div>
    );
};

export default CollectionPreviewStrip;

'use client';

import React, { memo } from 'react';

import EntryCard from '@/components/entry-card/entry-card';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import {
    Group as CollectionGroup,
    useCollectionContext,
} from '@/services/providers/collection-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    group: CollectionGroup;
}

const CollectionGrid = ({ group }: Props) => {
    const {
        groups,
        setState: setCollectionState,
        content_type,
    } = useCollectionContext();

    const items = groups.find((g) => g.id === group.id)?.items || [];

    const poster = (content: API.Anime | API.Character | API.Person) =>
        'poster' in content ? content.poster : content.image;
    const title = (content: API.Anime | API.Character | API.Person) =>
        'title_ua' in content
            ? content.title_ua || content.title_en || content.title_ja
            : content.name_ua || content.name_en;

    return (
        <div className="flex flex-col gap-4">
            {group.isGroup && (
                <Header
                    title={
                        group.title && group.title.trim().length > 0
                            ? group.title
                            : 'Нова група'
                    }
                    variant="h5"
                />
            )}
            <Stack size={5} extendedSize={5} extended>
                {items.map((item) => (
                    <EntryCard
                        slug={item.content.slug}
                        content_type={content_type}
                        href={`${CONTENT_TYPE_LINKS[content_type]}/${item.content.slug}`}
                        key={item.id}
                        poster={poster(item.content)}
                        title={title(item.content)}
                        watch={
                            'watch' in item.content &&
                            item.content.watch.length > 0
                                ? item.content.watch[0]
                                : undefined
                        }
                    />
                ))}
            </Stack>
        </div>
    );
};

export default memo(CollectionGrid);

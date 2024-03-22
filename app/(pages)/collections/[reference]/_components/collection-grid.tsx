'use client';

import React from 'react';

import SubHeader from '@/components/sub-header';
import EntryCard from '@/components/entry-card/entry-card';
import {
    Group as CollectionGroup,
    useCollectionContext,
} from '@/services/providers/collection-provider';

interface Props {
    group: CollectionGroup;
}

const Component = ({ group }: Props) => {
    const { groups, setState: setCollectionState } = useCollectionContext();

    const items = groups.find((g) => g.id === group.id)?.items;

    if (!items) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {group.isGroup && (
                <SubHeader
                    title={
                        group.title && group.title.trim().length > 0
                            ? group.title
                            : 'Нова група'
                    }
                    variant="h5"
                />
            )}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                {items.map((item) => (
                    <EntryCard
                        slug={item.content.slug}
                        content_type="anime"
                        href={`/anime/${item.content.slug}`}
                        key={item.id}
                        poster={item.content.poster}
                        title={
                            item.content.title_ua ||
                            item.content.title_en ||
                            item.content.title_ja
                        }
                        watch={item.content.watch.length > 0 ? item.content.watch[0] : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;

'use client';

import React from 'react';

import SubHeader from '@/components/sub-header';
import BaseCard from '@/components/ui/base-card';
import {
    Group as CollectionGroup,
    useCollectionContext,
} from '@/services/providers/collection-provider';
import AnimeCard from '@/components/anime-card';

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
                    <AnimeCard
                        slug={item.content.slug}
                        href={`/anime/${item.content.slug}`}
                        key={item.id}
                        poster={item.content.poster}
                        title={
                            item.content.title_ua ||
                            item.content.title_en ||
                            item.content.title_ja
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default Component;

'use client';

import React, { FC } from 'react';

import { useParams } from 'next/navigation';

import AnimeCard from '@/app/(pages)/(content)/components/anime-card';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import usePersonAnime from '@/services/hooks/people/usePersonAnime';

interface Props {
    extended?: boolean;
}

const Anime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonAnime({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header
                title={'Аніме'}
                href={!extended ? params.slug + '/anime' : undefined}
            />
            <Stack
                size={5}
                extendedSize={5}
                extended={extended}
                className="grid-min-10"
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <AnimeCard
                        key={ch.anime.slug}
                        anime={ch.anime}
                        description={
                            ch.roles[0]?.name_ua || ch.roles[0]?.name_en
                        }
                    />
                ))}
            </Stack>
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </Block>
    );
};

export default Anime;

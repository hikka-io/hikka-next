'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import usePersonCharacters from '@/services/hooks/people/usePersonCharacters';

import CharacterAnimeCard from '../../../components/character-anime-card';

interface Props {
    extended?: boolean;
}

const Characters = ({ extended }: Props) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonCharacters({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header
                title={'Персонажі'}
                href={!extended ? params.slug + '/characters' : undefined}
            />
            <Stack
                size={5}
                extended={extended}
                extendedSize={5}
                className="grid-min-10"
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <CharacterAnimeCard
                        anime={ch.anime}
                        character={ch.character}
                        key={ch.character.slug + ch.anime.slug}
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

export default Characters;

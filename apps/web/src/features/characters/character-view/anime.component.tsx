'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import useCharacterAnime from '@/services/hooks/characters/use-character-anime';

interface Props {
    extended?: boolean;
}

const Anime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterAnime({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header href={!extended ? params.slug + '/anime' : undefined}>
                <HeaderContainer>
                    <HeaderTitle>Аніме</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack
                size={5}
                extendedSize={5}
                className="grid-min-10"
                extended={extended}
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <AnimeCard key={ch.anime.slug} anime={ch.anime} />
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

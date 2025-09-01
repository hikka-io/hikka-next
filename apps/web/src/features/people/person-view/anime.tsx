'use client';

import { usePersonAnime } from '@hikka/react';
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
            <Header href={!extended ? params.slug + '/anime' : undefined}>
                <HeaderContainer>
                    <HeaderTitle>Аніме</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
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
                            ch.roles[0]?.name_ua ||
                            ch.roles[0]?.name_en ||
                            undefined
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

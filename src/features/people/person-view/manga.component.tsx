'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import MangaCard from '@/components/manga-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import usePersonManga from '@/services/hooks/people/use-person-manga';

interface Props {
    extended?: boolean;
}

const Manga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonManga({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header href={!extended ? params.slug + '/manga' : undefined}>
                <HeaderContainer>
                    <HeaderTitle>Манґа</HeaderTitle>
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
                    <MangaCard
                        key={ch.manga.slug}
                        manga={ch.manga}
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

export default Manga;

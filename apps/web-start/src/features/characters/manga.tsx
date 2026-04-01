'use client';

import { useCharacterManga } from '@hikka/react';
import { FC } from 'react';

import MangaCard from '@/components/content-card/manga-card';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import { useParams } from '@/utils/navigation';

interface Props {
    extended?: boolean;
}

const Manga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterManga({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header
                href={
                    !extended ? `/characters/${params.slug}/manga` : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Манґа</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={4} extendedSize={5} extended={extended}>
                {(extended ? list : list.slice(0, 4)).map((ch) => (
                    <MangaCard key={ch.manga.slug} manga={ch.manga} />
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

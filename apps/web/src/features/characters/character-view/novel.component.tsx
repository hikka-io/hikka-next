'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import Stack from '@/components/ui/stack';
import useCharacterNovel from '@/services/hooks/characters/use-character-novel';

interface Props {
    extended?: boolean;
}

const Novel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterNovel({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header href={!extended ? params.slug + '/novel' : undefined}>
                <HeaderContainer>
                    <HeaderTitle>Ранобе</HeaderTitle>
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
                    <NovelCard key={ch.novel.slug} novel={ch.novel} />
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

export default Novel;

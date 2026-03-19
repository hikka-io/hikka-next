'use client';

import { useCharacterNovel } from '@hikka/react';
import { FC } from 'react';

import NovelCard from '@/components/content-card/novel-card';
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

const Novel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterNovel({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header
                href={
                    !extended ? `/characters/${params.slug}/novel` : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Ранобе</HeaderTitle>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <Stack size={4} extendedSize={5} extended={extended}>
                {(extended ? list : list.slice(0, 4)).map((ch) => (
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

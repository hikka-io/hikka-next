'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import NovelCard from '@/components/novel-card';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import Stack from '@/components/ui/stack';

import usePersonNovel from '@/services/hooks/people/use-person-novel';

interface Props {
    extended?: boolean;
}

const Novel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonNovel({ slug: String(params.slug) });

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Block>
            <Header
                title={'Ранобе'}
                href={!extended ? params.slug + '/novel' : undefined}
            />
            <Stack
                size={5}
                extendedSize={5}
                extended={extended}
                className="grid-min-10"
            >
                {(extended ? list : list.slice(0, 5)).map((ch) => (
                    <NovelCard
                        key={ch.novel.slug}
                        novel={ch.novel}
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

export default Novel;

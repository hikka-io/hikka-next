'use client';

import { usePersonNovel } from '@hikka/react';
import { getTitle } from '@hikka/react/utils';
import { FC } from 'react';

import NovelCard from '@/components/content-card/novel-card';

import AppearanceGrid from '@/features/common/appearance-grid';

import { useParams } from '@/utils/navigation';

interface Props {
    extended?: boolean;
}

const Novel: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonNovel({ slug: String(params.slug) });

    return (
        <AppearanceGrid
            title="Ранобе"
            href={`/people/${params.slug}/novel`}
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <NovelCard
                    key={ch.novel.slug}
                    novel={ch.novel}
                    description={ch.roles[0] ? getTitle(ch.roles[0]) : undefined}
                />
            )}
        />
    );
};

export default Novel;

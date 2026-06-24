'use client';

import { useCharacterNovel } from '@hikka/react';
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
        useCharacterNovel({ slug: String(params.slug) });

    return (
        <AppearanceGrid
            title="Ранобе"
            href={`/characters/${params.slug}/novel`}
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <NovelCard key={ch.novel.slug} novel={ch.novel} />
            )}
        />
    );
};

export default Novel;

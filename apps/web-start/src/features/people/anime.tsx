'use client';

import type { FC } from 'react';

import { usePersonAnime } from '@hikka/react';
import { getTitle } from '@hikka/react/utils';

import AnimeCard from '@/components/content-card/anime-card';
import AppearanceGrid from '@/features/common/appearance-grid';
import { useParams } from '@/utils/navigation';

interface Props {
    extended?: boolean;
}

const Anime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonAnime({ slug: String(params.slug) });

    return (
        <AppearanceGrid
            title="Аніме"
            href={`/people/${params.slug}/anime`}
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <AnimeCard
                    key={ch.anime.slug}
                    anime={ch.anime}
                    description={
                        ch.roles[0] ? getTitle(ch.roles[0]) : undefined
                    }
                />
            )}
        />
    );
};

export default Anime;

'use client';

import type { FC } from 'react';

import { usePersonManga } from '@hikka/react';
import { getTitle } from '@hikka/react/utils';

import MangaCard from '@/components/content-card/manga-card';
import AppearanceGrid from '@/features/common/appearance-grid';
import { useParams } from '@/utils/navigation';

type Props = {
    extended?: boolean;
};

const Manga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        usePersonManga({ slug: String(params.slug) });

    return (
        <AppearanceGrid
            title="Манґа"
            href={`/people/${params.slug}/manga`}
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <MangaCard
                    key={ch.manga.slug}
                    manga={ch.manga}
                    description={
                        ch.roles[0] ? getTitle(ch.roles[0]) : undefined
                    }
                />
            )}
        />
    );
};

export default Manga;

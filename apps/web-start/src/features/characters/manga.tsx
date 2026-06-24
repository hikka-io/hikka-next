'use client';

import { useCharacterManga } from '@hikka/react';
import { FC } from 'react';

import MangaCard from '@/components/content-card/manga-card';

import AppearanceGrid from '@/features/common/appearance-grid';

import { useParams } from '@/utils/navigation';

interface Props {
    extended?: boolean;
}

const Manga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterManga({ slug: String(params.slug) });

    return (
        <AppearanceGrid
            title="Манґа"
            href={`/characters/${params.slug}/manga`}
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <MangaCard key={ch.manga.slug} manga={ch.manga} />
            )}
        />
    );
};

export default Manga;

import type { FC } from 'react';

import { personMangaInfiniteOptions } from '@hikka/api';

import MangaCard from '@/components/content-card/manga-card';
import AppearanceGrid from '@/features/entities/appearance-grid';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

type Props = {
    extended?: boolean;
};

const Manga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            personMangaInfiniteOptions({
                path: { slug: String(params.slug) },
            }),
        );

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

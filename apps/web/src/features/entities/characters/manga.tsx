import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import MangaCard from '@/components/content-card/manga-card';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import AppearanceGrid from '../appearance-grid';
import { entityAppearanceOptions } from '../queries';

type Props = {
    extended?: boolean;
};

const CharacterManga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            entityAppearanceOptions(
                ContentTypeEnum.CHARACTER,
                'manga',
                String(params.slug),
                { preview: !extended },
            ),
        );

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
                <MangaCard key={ch.manga.slug} item={ch.manga} />
            )}
        />
    );
};

export default CharacterManga;

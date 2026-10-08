import type { FC } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import AnimeCard from '@/components/content-card/anime-card';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import AppearanceGrid from '../appearance-grid';
import { entityAppearanceOptions } from '../queries';

type Props = {
    extended?: boolean;
};

const CharacterAnime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            entityAppearanceOptions(
                ContentTypeEnum.CHARACTER,
                'anime',
                String(params.slug),
                { preview: !extended },
            ),
        );

    return (
        <AppearanceGrid
            title="Аніме"
            href={`/characters/${params.slug}/anime`}
            extended={extended}
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <AnimeCard key={ch.anime.slug} item={ch.anime} />
            )}
        />
    );
};

export default CharacterAnime;

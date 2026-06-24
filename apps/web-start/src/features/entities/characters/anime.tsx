import type { FC } from 'react';

import { useCharacterAnime } from '@hikka/react';

import AnimeCard from '@/components/content-card/anime-card';
import AppearanceGrid from '@/features/entities/appearance-grid';
import { useParams } from '@/utils/navigation';

type Props = {
    extended?: boolean;
};

const Anime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacterAnime({ slug: String(params.slug) });

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
                <AnimeCard key={ch.anime.slug} anime={ch.anime} />
            )}
        />
    );
};

export default Anime;

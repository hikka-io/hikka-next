import type { FC } from 'react';

import { personVoicesInfiniteOptions } from '@hikka/api';

import CharacterAnimeCard from '@/components/content-card/character-anime-card';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import AppearanceGrid from '../appearance-grid';

type Props = {
    extended?: boolean;
};

const PersonCharacters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            personVoicesInfiniteOptions({
                path: { slug: String(params.slug) },
            }),
        );

    return (
        <AppearanceGrid
            title="Персонажі"
            href={`/people/${params.slug}/characters`}
            extended={extended}
            stackClassName="grid-cols-3 sm:grid-cols-4"
            list={list}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            ref={ref}
            renderItem={(ch) => (
                <CharacterAnimeCard
                    anime={ch.anime}
                    character={ch.character}
                    key={ch.character.slug + ch.anime.slug}
                />
            )}
        />
    );
};

export default PersonCharacters;

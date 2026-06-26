import type { ComponentProps, FC } from 'react';

import { personAnimeInfiniteOptions } from '@hikka/api';
import { getTitle } from '@hikka/react/utils';

import AnimeCard from '@/components/content-card/anime-card';
import AppearanceGrid from '@/features/entities/appearance-grid';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

type Props = {
    extended?: boolean;
};

const Anime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            personAnimeInfiniteOptions({
                path: { slug: String(params.slug) },
            }),
        );

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
                    // TODO(phase2): drop cast
                    anime={
                        ch.anime as unknown as ComponentProps<
                            typeof AnimeCard
                        >['anime']
                    }
                    description={
                        ch.roles[0] ? getTitle(ch.roles[0]) : undefined
                    }
                />
            )}
        />
    );
};

export default Anime;

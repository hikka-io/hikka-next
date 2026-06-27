import type { FC } from 'react';

import {
    type AnimeResponseWithWatch,
    ContentTypeEnum,
    type MangaResponseWithRead,
    type NovelResponseWithRead,
    type ReadResponse,
    type WatchResponse,
} from '@hikka/api';

import AnimeCard from '@/components/content-card/anime-card';
import MangaCard from '@/components/content-card/manga-card';
import NovelCard from '@/components/content-card/novel-card';
import Stack, { type StackSize } from '@/components/ui/stack';

type Props = {
    data: ReadResponse[] | WatchResponse[];
    content_type: 'anime' | 'manga' | 'novel';
    extendedSize?: StackSize;
};

const GridView: FC<Props> = ({ data, content_type, extendedSize = 5 }) => {
    return (
        <Stack size={5} extendedSize={extendedSize} extended>
            {content_type !== ContentTypeEnum.ANIME &&
                (data as ReadResponse[]).map((res) =>
                    res.content.data_type === 'manga' ? (
                        <MangaCard
                            read={res}
                            manga={res.content as MangaResponseWithRead}
                            key={res.reference}
                        />
                    ) : (
                        <NovelCard
                            read={res}
                            novel={res.content as NovelResponseWithRead}
                            key={res.reference}
                        />
                    ),
                )}
            {content_type === ContentTypeEnum.ANIME &&
                (data as WatchResponse[]).map((res) => (
                    <AnimeCard
                        watch={res}
                        anime={res.anime as AnimeResponseWithWatch}
                        key={res.reference}
                    />
                ))}
        </Stack>
    );
};

export default GridView;

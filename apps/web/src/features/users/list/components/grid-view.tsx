import type { FC } from 'react';

import {
    type AnimeResponseWithWatch,
    ContentTypeEnum,
    type MainContentTypeEnum,
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
    content_type: MainContentTypeEnum;
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
                            item={res.content as MangaResponseWithRead}
                            key={res.reference}
                        />
                    ) : (
                        <NovelCard
                            read={res}
                            item={res.content as NovelResponseWithRead}
                            key={res.reference}
                        />
                    ),
                )}
            {content_type === ContentTypeEnum.ANIME &&
                (data as WatchResponse[]).map((res) => (
                    <AnimeCard
                        watch={res}
                        item={res.anime as AnimeResponseWithWatch}
                        key={res.reference}
                    />
                ))}
        </Stack>
    );
};

export default GridView;

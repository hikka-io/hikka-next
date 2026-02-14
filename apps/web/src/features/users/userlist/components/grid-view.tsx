'use client';

import { ContentTypeEnum, ReadResponse, WatchResponse } from '@hikka/client';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import MangaCard from '@/components/manga-card';
import NovelCard from '@/components/novel-card';
import Stack from '@/components/ui/stack';

interface Props {
    data: ReadResponse[] | WatchResponse[];
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const GridView: FC<Props> = ({ data, content_type }) => {
    return (
        <Stack size={5} extendedSize={5} extended>
            {content_type !== ContentTypeEnum.ANIME &&
                (data as ReadResponse[]).map((res) =>
                    res.content.data_type === 'manga' ? (
                        <MangaCard
                            read={res}
                            manga={res.content}
                            key={res.reference}
                        />
                    ) : (
                        <NovelCard
                            read={res}
                            novel={res.content}
                            key={res.reference}
                        />
                    ),
                )}
            {content_type === ContentTypeEnum.ANIME &&
                (data as WatchResponse[]).map((res) => (
                    <AnimeCard
                        watch={res}
                        anime={res.anime}
                        key={res.reference}
                    />
                ))}
        </Stack>
    );
};

export default GridView;

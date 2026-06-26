import type { ComponentProps, FC } from 'react';

import {
    ContentTypeEnum,
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
                            read={
                                // TODO(phase2): drop cast once content-card is on @hikka/api
                                res as unknown as ComponentProps<
                                    typeof MangaCard
                                >['read']
                            }
                            manga={
                                res.content as unknown as ComponentProps<
                                    typeof MangaCard
                                >['manga']
                            }
                            key={res.reference}
                        />
                    ) : (
                        <NovelCard
                            read={
                                // TODO(phase2): drop cast once content-card is on @hikka/api
                                res as unknown as ComponentProps<
                                    typeof NovelCard
                                >['read']
                            }
                            novel={
                                res.content as unknown as ComponentProps<
                                    typeof NovelCard
                                >['novel']
                            }
                            key={res.reference}
                        />
                    ),
                )}
            {content_type === ContentTypeEnum.ANIME &&
                (data as WatchResponse[]).map((res) => (
                    <AnimeCard
                        watch={
                            // TODO(phase2): drop cast once content-card is on @hikka/api
                            res as unknown as ComponentProps<
                                typeof AnimeCard
                            >['watch']
                        }
                        anime={
                            res.anime as unknown as ComponentProps<
                                typeof AnimeCard
                            >['anime']
                        }
                        key={res.reference}
                    />
                ))}
        </Stack>
    );
};

export default GridView;

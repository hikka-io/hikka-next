import { type FC, Fragment } from 'react';

import { useRouter } from '@tanstack/react-router';

import {
    type AnimeMediaEnum,
    ContentTypeEnum,
    type ReadResponse,
    type WatchResponse,
} from '@hikka/api';

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import ChaptersCell from './chapters-cell';
import DetailsCell from './details-cell';
import EpisodesCell from './episodes-cell';
import MediaCell from './media-cell';
import NumberCell from './number-cell';
import ScoreCell from './score-cell';
import SortableHead from './sortable-head';
import VolumesCell from './volumes-cell';

type Props = {
    data: ReadResponse[] | WatchResponse[];
    content_type: 'anime' | 'manga' | 'novel';
};

const TableView: FC<Props> = ({ data, content_type }) => {
    const search = useFilterSearch<{
        order?: string;
        sort?: string | string[];
    }>();
    const router = useRouter();

    const order = (search.order as 'asc' | 'desc' | null) || null;
    const sortRaw = search.sort;
    const scoreSort =
        content_type === ContentTypeEnum.ANIME ? 'watch_score' : 'read_score';
    const sort = sortRaw
        ? Array.isArray(sortRaw)
            ? sortRaw
            : [sortRaw]
        : [scoreSort];

    const switchSort = (
        newSort:
            | 'watch_score'
            | 'read_score'
            | 'read_chapters'
            | 'read_volumes'
            | 'watch_episodes'
            | 'media_type',
    ) => {
        const newOrder =
            order && newSort !== sort[0]
                ? order
                : order === 'asc'
                  ? 'desc'
                  : 'asc';

        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => ({
                ...prev,
                sort: newSort,
                order: newOrder,
            }),
            replace: true,
        } as any);
    };

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="bg-secondary/20 [&_tr]:border-b">
                    <TableRow className="hover:bg-transparent">
                        <TableHead>#</TableHead>
                        <TableHead>Деталі</TableHead>
                        <SortableHead
                            className="w-4"
                            active={sort.includes(scoreSort)}
                            order={order}
                            onSort={() => switchSort(scoreSort)}
                        >
                            Оцінка
                        </SortableHead>
                        {content_type !== ContentTypeEnum.ANIME && (
                            <Fragment>
                                <SortableHead
                                    active={sort.includes('read_chapters')}
                                    order={order}
                                    onSort={() => switchSort('read_chapters')}
                                >
                                    Розділи
                                </SortableHead>
                                <SortableHead
                                    active={sort.includes('read_volumes')}
                                    order={order}
                                    onSort={() => switchSort('read_volumes')}
                                >
                                    Томи
                                </SortableHead>
                            </Fragment>
                        )}
                        {content_type === ContentTypeEnum.ANIME && (
                            <Fragment>
                                <SortableHead
                                    active={sort.includes('watch_episodes')}
                                    order={order}
                                    onSort={() => switchSort('watch_episodes')}
                                >
                                    Епізоди
                                </SortableHead>
                                <SortableHead
                                    className="hidden w-20 lg:table-cell"
                                    active={sort.includes('media_type')}
                                    order={order}
                                    onSort={() => switchSort('media_type')}
                                >
                                    Тип
                                </SortableHead>
                            </Fragment>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((res, i) => {
                        const isAnime = content_type === ContentTypeEnum.ANIME;
                        const content = isAnime
                            ? (res as WatchResponse).anime
                            : (res as ReadResponse).content;
                        const repeats = isAnime
                            ? (res as WatchResponse).rewatches
                            : (res as ReadResponse).rereads;

                        return (
                            <TableRow key={res.reference} className="group">
                                <NumberCell
                                    record={res}
                                    content_type={content_type}
                                    content={content}
                                    number={i + 1}
                                />
                                <DetailsCell
                                    note={res.note || undefined}
                                    content_type={content_type}
                                    content={content}
                                    repeats={repeats}
                                />
                                <ScoreCell score={res.score} />
                                {content_type !== ContentTypeEnum.ANIME && (
                                    <Fragment>
                                        <ChaptersCell
                                            chapters={
                                                (res as ReadResponse).chapters
                                            }
                                            total={
                                                (res as ReadResponse).content
                                                    .chapters
                                            }
                                        />
                                        <VolumesCell
                                            volumes={
                                                (res as ReadResponse).volumes
                                            }
                                            total={
                                                (res as ReadResponse).content
                                                    .volumes
                                            }
                                        />
                                    </Fragment>
                                )}
                                {content_type === ContentTypeEnum.ANIME && (
                                    <Fragment>
                                        <EpisodesCell
                                            episodes={
                                                (res as WatchResponse).episodes
                                            }
                                            total={
                                                (res as WatchResponse).anime
                                                    .episodes_total
                                            }
                                        />
                                        <MediaCell
                                            media_type={
                                                (res as WatchResponse).anime
                                                    .media_type as
                                                    | AnimeMediaEnum
                                                    | null
                                            }
                                        />
                                    </Fragment>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableView;

'use client';

import { ContentTypeEnum, ReadResponse, WatchResponse } from '@hikka/client';
import { useRouter } from '@tanstack/react-router';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { FC, Fragment, useRef } from 'react';

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { cn } from '@/utils/cn';

import ChaptersCell from './chapters-cell';
import DetailsCell from './details-cell';
import EpisodesCell from './episodes-cell';
import MediaCell from './media-cell';
import NumberCell from './number-cell';
import ScoreCell from './score-cell';
import VolumesCell from './volumes-cell';

interface Props {
    data: ReadResponse[] | WatchResponse[];
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const ROW_HEIGHT_ESTIMATE = 53;

const TableView: FC<Props> = ({ data, content_type }) => {
    const search = useFilterSearch<{
        order?: string;
        sort?: string | string[];
    }>();
    const router = useRouter();
    const tableBodyRef = useRef<HTMLTableSectionElement>(null);

    const order = search.order || null;
    const sortRaw = search.sort;
    const sort = sortRaw
        ? Array.isArray(sortRaw)
            ? sortRaw
            : [sortRaw]
        : ['watch_score'];

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

    const rowVirtualizer = useWindowVirtualizer({
        count: data.length,
        estimateSize: () => ROW_HEIGHT_ESTIMATE,
        overscan: 10,
        scrollMargin: tableBodyRef.current?.offsetTop ?? 0,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const colCount = content_type === ContentTypeEnum.ANIME ? 5 : 6;

    const paddingTop =
        virtualRows.length > 0
            ? virtualRows[0].start -
              (rowVirtualizer.options.scrollMargin ?? 0)
            : 0;
    const paddingBottom =
        virtualRows.length > 0
            ? rowVirtualizer.getTotalSize() -
              virtualRows[virtualRows.length - 1].end
            : 0;

    return (
        <Table className="table">
            <TableHeader className="bg-secondary/20 overflow-hidden rounded-lg backdrop-blur [&_tr]:border-b-0">
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Деталі</TableHead>
                    <TableHead
                        className={cn(
                            'w-4 cursor-pointer text-center select-none hover:underline',
                            sort.includes(
                                content_type === ContentTypeEnum.ANIME
                                    ? 'watch_score'
                                    : 'read_score',
                            ) && 'text-primary-foreground',
                        )}
                        align="center"
                        onClick={() =>
                            switchSort(
                                content_type === ContentTypeEnum.ANIME
                                    ? 'watch_score'
                                    : 'read_score',
                            )
                        }
                    >
                        Оцінка
                    </TableHead>
                    {content_type !== ContentTypeEnum.ANIME && (
                        <Fragment>
                            <TableHead
                                className={cn(
                                    'cursor-pointer text-center select-none hover:underline',
                                    sort.includes('read_chapters') &&
                                        'text-primary-foreground',
                                )}
                                align="center"
                                onClick={() => switchSort('read_chapters')}
                            >
                                Розділи
                            </TableHead>
                            <TableHead
                                className={cn(
                                    'cursor-pointer text-center select-none hover:underline',
                                    sort.includes('read_volumes') &&
                                        'text-primary-foreground',
                                )}
                                align="center"
                                onClick={() => switchSort('read_volumes')}
                            >
                                Томи
                            </TableHead>
                        </Fragment>
                    )}
                    {content_type === ContentTypeEnum.ANIME && (
                        <Fragment>
                            <TableHead
                                className={cn(
                                    'cursor-pointer text-center select-none hover:underline',
                                    sort.includes('watch_episodes') &&
                                        'text-primary-foreground',
                                )}
                                align="center"
                                onClick={() => switchSort('watch_episodes')}
                            >
                                Епізоди
                            </TableHead>
                            <TableHead
                                className={cn(
                                    'hidden w-20 cursor-pointer text-center select-none hover:underline lg:table-cell',
                                    sort.includes('media_type') &&
                                        'text-primary-foreground',
                                )}
                                align="center"
                                onClick={() => switchSort('media_type')}
                            >
                                Тип
                            </TableHead>
                        </Fragment>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody ref={tableBodyRef}>
                {paddingTop > 0 && (
                    <tr>
                        <td
                            colSpan={colCount}
                            style={{
                                height: paddingTop,
                                padding: 0,
                                border: 'none',
                            }}
                        />
                    </tr>
                )}
                {virtualRows.map((virtualRow) => {
                    const res = data[virtualRow.index];
                    const i = virtualRow.index;

                    return (
                        <TableRow
                            key={res.reference}
                            ref={rowVirtualizer.measureElement}
                            data-index={virtualRow.index}
                            className="group"
                        >
                            <NumberCell
                                record={res}
                                content_type={content_type}
                                content={
                                    content_type === ContentTypeEnum.ANIME
                                        ? (res as WatchResponse).anime
                                        : (res as ReadResponse).content
                                }
                                number={i + 1}
                            />
                            <DetailsCell
                                note={res.note || undefined}
                                content_type={content_type}
                                content={
                                    content_type === ContentTypeEnum.ANIME
                                        ? (res as WatchResponse).anime
                                        : (res as ReadResponse).content
                                }
                                repeats={
                                    content_type === ContentTypeEnum.ANIME
                                        ? (res as WatchResponse).rewatches
                                        : (res as ReadResponse).rereads
                                }
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
                                                .media_type
                                        }
                                    />
                                </Fragment>
                            )}
                        </TableRow>
                    );
                })}
                {paddingBottom > 0 && (
                    <tr>
                        <td
                            colSpan={colCount}
                            style={{
                                height: paddingBottom,
                                padding: 0,
                                border: 'none',
                            }}
                        />
                    </tr>
                )}
            </TableBody>
        </Table>
    );
};

export default TableView;

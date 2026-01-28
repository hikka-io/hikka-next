'use client';

import { ContentTypeEnum, ReadResponse, WatchResponse } from '@hikka/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, Fragment } from 'react';

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { cn } from '@/utils/cn';
import { createQueryString } from '@/utils/url';

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

const TableView: FC<Props> = ({ data, content_type }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const order = searchParams.get('order');
    const sort = searchParams.getAll('sort').length > 0 ? searchParams.getAll('sort') : ['watch_score'];

    const switchSort = (
        newSort:
            | 'watch_score'
            | 'read_score'
            | 'read_chapters'
            | 'read_volumes'
            | 'watch_episodes'
            | 'media_type',
    ) => {
        const query = createQueryString(
            'order',
            order && newSort !== sort[0]
                ? order
                : order === 'asc'
                  ? 'desc'
                  : 'asc',
            createQueryString(
                'sort',
                newSort,
                new URLSearchParams(searchParams),
            ),
        ).toString();

        router.replace(`${pathname}?${query}`);
    };

    return (
        <Table className="table">
            <TableHeader className="overflow-hidden rounded-lg bg-secondary/20 backdrop-blur [&_tr]:border-b-0">
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Деталі</TableHead>
                    {content_type !== ContentTypeEnum.ANIME && (
                        <Fragment>
                            <TableHead
                                className={cn(
                                    'cursor-pointer select-none text-center hover:underline',
                                    sort === 'read_chapters' &&
                                        'text-primary-foreground',
                                )}
                                align="center"
                                onClick={() => switchSort('read_chapters')}
                            >
                                Розділи
                            </TableHead>
                            <TableHead
                                className={cn(
                                    'cursor-pointer select-none text-center hover:underline',
                                    sort === 'read_volumes' &&
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
                                    'cursor-pointer select-none text-center hover:underline',
                                    sort === 'watch_episodes' &&
                                        'text-primary-foreground',
                                )}
                                align="center"
                                onClick={() => switchSort('watch_episodes')}
                            >
                                Епізоди
                            </TableHead>
                            <TableHead
                                className={cn(
                                    'hidden w-20 cursor-pointer select-none text-center hover:underline lg:table-cell',
                                    sort === 'media_type' &&
                                        'text-primary-foreground',
                                )}
                                align="center"
                                onClick={() => switchSort('media_type')}
                            >
                                Тип
                            </TableHead>
                        </Fragment>
                    )}
                    <TableHead
                        className={cn(
                            'w-4 cursor-pointer select-none text-right hover:underline',
                            sort ===
                                (content_type === ContentTypeEnum.ANIME
                                    ? 'watch_score'
                                    : 'read_score') &&
                                'text-primary-foreground',
                        )}
                        align="right"
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
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((res, i) => (
                    <TableRow key={res.reference} className="group">
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
                        {content_type !== ContentTypeEnum.ANIME && (
                            <Fragment>
                                <ChaptersCell
                                    chapters={(res as ReadResponse).chapters}
                                    total={
                                        (res as ReadResponse).content.chapters
                                    }
                                />
                                <VolumesCell
                                    volumes={(res as ReadResponse).volumes}
                                    total={
                                        (res as ReadResponse).content.volumes
                                    }
                                />
                            </Fragment>
                        )}
                        {content_type === ContentTypeEnum.ANIME && (
                            <Fragment>
                                <EpisodesCell
                                    episodes={(res as WatchResponse).episodes}
                                    total={
                                        (res as WatchResponse).anime
                                            .episodes_total
                                    }
                                />
                                <MediaCell
                                    media_type={
                                        (res as WatchResponse).anime.media_type
                                    }
                                />
                            </Fragment>
                        )}
                        <ScoreCell score={res.score} />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableView;

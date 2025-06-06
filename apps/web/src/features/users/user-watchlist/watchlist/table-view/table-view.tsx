'use client';

import { WatchResponse } from '@hikka/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import createQueryString from '@/utils/create-query-string';
import { cn } from '@/utils/utils';

import DetailsCell from './details-cell';
import EpisodesCell from './episodes-cell';
import MediaCell from './media-cell';
import NumberCell from './number-cell';
import ScoreCell from './score-cell';

interface Props {
    data: WatchResponse[];
}

const TableView: FC<Props> = ({ data }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const switchSort = (
        newSort: 'watch_score' | 'watch_episodes' | 'media_type',
    ) => {
        const query = createQueryString(
            'order',
            order && newSort !== sort
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
            <TableHeader className="bg-secondary/20 overflow-hidden rounded-lg backdrop-blur [&_tr]:border-b-0">
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Деталі</TableHead>
                    <TableHead
                        className={cn(
                            'cursor-pointer select-none text-center hover:underline',
                            sort === 'watch_episodes' && 'text-primary',
                        )}
                        align="center"
                        onClick={() => switchSort('watch_episodes')}
                    >
                        Епізоди
                    </TableHead>
                    <TableHead
                        className={cn(
                            'hidden w-20 cursor-pointer select-none text-center hover:underline lg:table-cell',
                            sort === 'media_type' && 'text-primary',
                        )}
                        align="center"
                        onClick={() => switchSort('media_type')}
                    >
                        Тип
                    </TableHead>
                    <TableHead
                        className={cn(
                            'w-4 cursor-pointer select-none text-right hover:underline',
                            sort === 'watch_score' && 'text-primary',
                        )}
                        align="right"
                        onClick={() => switchSort('watch_score')}
                    >
                        Оцінка
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((res, i) => (
                    <TableRow key={res.reference} className="group">
                        <NumberCell
                            watch={res}
                            anime={res.anime}
                            number={i + 1}
                        />
                        <DetailsCell
                            note={res.note || undefined}
                            anime={res.anime}
                            rewatches={res.rewatches}
                        />
                        <EpisodesCell
                            episodes={res.episodes}
                            total={res.anime.episodes_total || undefined}
                        />
                        <MediaCell
                            media_type={res.anime.media_type || undefined}
                        />
                        <ScoreCell score={res.score} />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableView;

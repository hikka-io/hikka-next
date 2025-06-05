'use client';

import { ReadContentType, ReadResponse } from '@hikka/client';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
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

import ChaptersCell from './chapters-cell';
import DetailsCell from './details-cell';
import NumberCell from './number-cell';
import ScoreCell from './score-cell';
import VolumesCell from './volumes-cell';

interface Props {
    data: ReadResponse[];
}

const TableView: FC<Props> = ({ data }) => {
    const params = useParams();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const switchSort = (
        newSort: 'read_score' | 'read_chapters' | 'read_volumes' | 'media_type',
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
                            sort === 'read_chapters' && 'text-primary',
                        )}
                        align="center"
                        onClick={() => switchSort('read_chapters')}
                    >
                        Розділи
                    </TableHead>
                    <TableHead
                        className={cn(
                            'cursor-pointer select-none text-center hover:underline',
                            sort === 'read_volumes' && 'text-primary',
                        )}
                        align="center"
                        onClick={() => switchSort('read_volumes')}
                    >
                        Томи
                    </TableHead>
                    <TableHead
                        className={cn(
                            'w-4 cursor-pointer select-none text-right hover:underline',
                            sort === 'read_score' && 'text-primary',
                        )}
                        align="right"
                        onClick={() => switchSort('read_score')}
                    >
                        Оцінка
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((res, i) => (
                    <TableRow key={res.reference} className="group">
                        <NumberCell
                            read={res}
                            content_type={
                                params.content_type as ReadContentType
                            }
                            content={res.content}
                            number={i + 1}
                        />
                        <DetailsCell
                            note={res.note || undefined}
                            content_type={
                                params.content_type as ReadContentType
                            }
                            content={res.content}
                            rereads={res.rereads}
                        />
                        <ChaptersCell
                            chapters={res.chapters}
                            total={res.content.chapters || undefined}
                        />
                        <VolumesCell
                            volumes={res.volumes}
                            total={res.content.volumes || undefined}
                        />
                        <ScoreCell score={res.score} />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableView;

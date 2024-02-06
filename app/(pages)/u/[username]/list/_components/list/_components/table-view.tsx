'use client';

import clsx from 'clsx';
import { CSSProperties, useState } from 'react';

import Link from 'next/link';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import WatchEditModal from '@/app/_components/modals/watch-edit-modal';
import { Badge } from '@/app/_components/ui/badge';
import BaseCard from '@/app/_components/ui/base-card';
import { Label } from '@/app/_components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/_components/ui/table';
import { MEDIA_TYPE } from '@/app/_utils/constants';
import createQueryString from '@/app/_utils/createQueryString';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';
import { useModalContext } from '@/app/_utils/providers/modal-provider';
import { useSettingsContext } from '@/app/_utils/providers/settings-provider';
import { useLoggedUser } from '@/app/page.hooks';

interface Props {
    data: Hikka.Watch[];
}

const Component = ({ data }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { openModal } = useModalContext();
    const params = useParams();
    const [go, setGo] = useState(false);

    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const { data: loggedUser } = useLoggedUser(String(secret));

    const switchOrder = (newOrder: 'score' | 'episodes' | 'media_type') => {
        let query;

        if (order && order === newOrder) {
            if (sort) {
                if (sort === 'asc') {
                    query = createQueryString(
                        'sort',
                        'desc',
                        new URLSearchParams(searchParams),
                    ).toString();
                } else if (sort === 'desc') {
                    query = createQueryString(
                        'sort',
                        'asc',
                        new URLSearchParams(searchParams),
                    ).toString();
                } else {
                    query = createQueryString(
                        'sort',
                        'desc',
                        new URLSearchParams(searchParams),
                    ).toString();
                }
            } else {
                query = createQueryString(
                    'sort',
                    'desc',
                    new URLSearchParams(searchParams),
                ).toString();
            }
        } else {
            query = createQueryString(
                'sort',
                'desc',
                createQueryString(
                    'order',
                    newOrder,
                    new URLSearchParams(searchParams),
                ),
            ).toString();
        }

        router.replace(`${pathname}?${query}`);
    };

    return (
        <div className="overflow-x-auto">
            <Table className="table">
                <TableHeader className="overflow-hidden rounded-lg bg-secondary/30 backdrop-blur [&_tr]:border-b-0">
                    <TableRow className="border-b-0">
                        <TableHead className="w-8">#</TableHead>
                        <TableHead>Деталі</TableHead>
                        <TableHead
                            className={clsx(
                                'w-20 cursor-pointer select-none hover:underline',
                                order === 'episodes' && 'text-primary',
                            )}
                            align="center"
                            onClick={() => switchOrder('episodes')}
                        >
                            Епізоди
                        </TableHead>
                        <TableHead
                            className={clsx(
                                'hidden w-32 cursor-pointer select-none hover:underline lg:table-cell text-center',
                                order === 'media_type' && 'text-primary',
                            )}
                            align="center"
                            onClick={() => switchOrder('media_type')}
                        >
                            Тип
                        </TableHead>
                        <TableHead
                            className={clsx(
                                'w-20 cursor-pointer select-none hover:underline',
                                order === 'score' && 'text-primary',
                            )}
                            align="center"
                            onClick={() => switchOrder('score')}
                        >
                            Оцінка
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((res, i) => (
                        <TableRow
                            key={res.reference}
                            onClick={() =>
                                !go &&
                                loggedUser?.username === params.username &&
                                openModal({
                                    content: (
                                        <WatchEditModal slug={res.anime.slug} />
                                    ),
                                    className: '!max-w-xl',
                                    title:
                                        res.anime[titleLanguage!] ||
                                        res.anime.title_ua ||
                                        res.anime.title_en ||
                                        res.anime.title_ja,
                                })
                            }
                        >
                            <TableHead className="w-8">
                                <Label className="text-muted-foreground">
                                    {i + 1}
                                </Label>
                            </TableHead>
                            <TableCell>
                                <div className="flex gap-4">
                                    <div className="hidden w-12 lg:block">
                                        <BaseCard poster={res.anime.poster} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex gap-2 items-center">
                                            <Link
                                                className="hover:underline"
                                                href={`/anime/${res.anime.slug}`}
                                                onClick={() => setGo(true)}
                                            >
                                                {res.anime[titleLanguage!] ||
                                                    res.anime.title_ua ||
                                                    res.anime.title_en ||
                                                    res.anime.title_ja}
                                            </Link>
                                            {res.rewatches > 0 && (
                                                <Badge variant="outline">
                                                    {res.rewatches}
                                                </Badge>
                                            )}
                                        </div>
                                        {res.note && (
                                            <p className="text-xs text-muted-foreground">
                                                {res.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="w-20" align="center">
                                {res.episodes} / {res.anime.episodes_total}
                            </TableCell>
                            <TableCell
                                className="hidden w-32 lg:table-cell"
                                align="center"
                            >
                                {res.anime.media_type &&
                                    MEDIA_TYPE[
                                        res.anime.media_type as Hikka.MediaType
                                    ].title_ua}
                            </TableCell>
                            <TableCell className="w-20" align="center">
                                <div
                                    className={clsx(
                                        'radial-progress border border-secondary text-primary',
                                    )}
                                    style={
                                        {
                                            '--value': res.score * 10,
                                            '--size': '2.5rem',
                                            '--thickness':
                                                res.score > 0 ? '2px' : '0px',
                                        } as CSSProperties
                                    }
                                    role="progressbar"
                                >
                                    {res.score}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default Component;
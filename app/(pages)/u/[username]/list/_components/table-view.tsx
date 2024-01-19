'use client';

import clsx from 'clsx';
import { CSSProperties, useCallback, useEffect, useState } from 'react';



import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';



import { useQueryClient } from '@tanstack/react-query';



import WatchEditModal from '@/app/(pages)/u/[username]/list/_layout/watch-edit-modal';
import BaseCard from '@/app/_components/base-card';
import Image from '@/app/_components/image';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/_components/ui/table';
import { MEDIA_TYPE } from '@/utils/constants';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import useRouter from '@/utils/useRouter';
import { useSettingsContext } from '@/utils/providers/settings-provider';
import { Label } from '@/app/_components/ui/label';


interface Props {
    data: {
        reference: string;
        updated: number;
        created: number;
        note: string;
        status: Hikka.WatchStatus;
        episodes: number;
        score: number;
        anime: Hikka.Anime;
    }[];
}

const Component = ({ data }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setState: setModalState } = useModalContext();
    const params = useParams();
    const [go, setGo] = useState(false);
    const [slug, setSlug] = useState<string | null>(null);

    const order = searchParams.get('order');
    const sort = searchParams.get('sort');

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    const createQueryString = useCallback(
        (
            name: string,
            value: string | string[] | boolean,
            ownParams?: URLSearchParams,
        ) => {
            const params = ownParams
                ? ownParams
                : new URLSearchParams(searchParams);
            // params.set('page', '1');

            if (value) {
                if (Array.isArray(value)) {
                    params.delete(name);
                    value.forEach((v) => params.append(name, String(v)));
                } else {
                    params.set(name, String(value));
                }
            } else {
                params.delete(name);
            }

            return params;
        },
        [searchParams],
    );

    const switchOrder = (newOrder: 'score' | 'episodes' | 'media_type') => {
        let query;

        if (order && order === newOrder) {
            if (sort) {
                if (sort === 'asc') {
                    query = createQueryString('sort', 'desc').toString();
                } else if (sort === 'desc') {
                    query = createQueryString('sort', 'asc').toString();
                } else {
                    query = createQueryString('sort', 'desc').toString();
                }
            } else {
                query = createQueryString('sort', 'desc').toString();
            }
        } else {
            query = createQueryString(
                'sort',
                'desc',
                createQueryString('order', newOrder),
            ).toString();
        }

        router.replace(`${pathname}?${query}`);
    };

    useEffect(() => {
        if (slug) {
            setModalState((prev) => ({ ...prev, animeSettings: true }));
        }
    }, [slug]);

    return (
        <div className="overflow-x-auto">
            <Table className="table">
                <TableHeader className="overflow-hidden rounded-lg bg-secondary/30 [&_tr]:border-b-0">
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
                            onClick={() => !go && setSlug(res.anime.slug)}
                        >
                            <TableHead className="w-8"><Label className="text-muted-foreground">{i + 1}</Label></TableHead>
                            <TableCell>
                                <div className="flex gap-4">
                                    <div className="hidden w-12 lg:block">
                                        <BaseCard poster={res.anime.poster} />
                                    </div>
                                    <div className="flex-1">
                                        <Link
                                            className="hover:underline"
                                            href={`/anime/${res.anime.slug}`}
                                            onClick={() => setGo(true)}
                                        >
                                            {res.anime[titleLanguage!] || res.anime.title_ua ||
                                                res.anime.title_en ||
                                                res.anime.title_ja}
                                        </Link>
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
                                {
                                    res.anime.media_type && MEDIA_TYPE[
                                        res.anime.media_type as Hikka.MediaType
                                    ].title_ua
                                }
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
            {!go && slug && loggedUser?.username === params.username && (
                <WatchEditModal slug={slug} setSlug={setSlug} />
            )}
        </div>
    );
};

export default Component;
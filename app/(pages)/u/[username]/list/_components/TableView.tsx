'use client';

import clsx from 'clsx';
import { CSSProperties, useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import WatchEditModal from '@/app/(pages)/u/[username]/list/_layout/WatchEditModal';
import Image from '@/app/_components/Image';
import { MEDIA_TYPE } from '@/utils/constants';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';
import useRouter from '@/utils/useRouter';

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
            <table className="table">
                <thead className="overflow-hidden rounded-lg bg-secondary/30">
                    <tr>
                        <th className="w-8">#</th>
                        <th>Деталі</th>
                        <th
                            className={clsx(
                                'w-20 cursor-pointer select-none hover:underline',
                                order === 'episodes' && 'text-accent',
                            )}
                            align="center"
                            onClick={() => switchOrder('episodes')}
                        >
                            Епізоди
                        </th>
                        <th
                            className={clsx(
                                'hidden w-32 cursor-pointer select-none hover:underline lg:table-cell',
                                order === 'media_type' && 'text-accent',
                            )}
                            align="center"
                            onClick={() => switchOrder('media_type')}
                        >
                            Тип
                        </th>
                        <th
                            className={clsx(
                                'w-20 cursor-pointer select-none hover:underline',
                                order === 'score' && 'text-accent',
                            )}
                            align="center"
                            onClick={() => switchOrder('score')}
                        >
                            Оцінка
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((res, i) => (
                        <tr
                            key={res.reference}
                            className={clsx(
                                loggedUser?.username === params.username &&
                                    'hover:cursor-pointer hover:bg-secondary/60',
                            )}
                            onClick={() => !go && setSlug(res.anime.slug)}
                        >
                            <th className="label-text w-8">{i + 1}</th>
                            <td>
                                <div className="flex gap-4">
                                    <div className="hidden w-12 lg:block">
                                        <div className="relative w-full overflow-hidden rounded-md pt-[140%]">
                                            <div className="absolute left-0 top-0">
                                                <Image
                                                    src={res.anime.poster}
                                                    alt="poster"
                                                    width="50"
                                                    height="50"
                                                    className="h-full w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Link
                                            className="hover:underline"
                                            href={`/anime/${res.anime.slug}`}
                                            onClick={() => setGo(true)}
                                        >
                                            {res.anime.title_ua ||
                                                res.anime.title_en ||
                                                res.anime.title_ja}
                                        </Link>
                                        {res.note && (
                                            <p className="label-text-alt opacity-60">
                                                {res.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="w-20" align="center">
                                {res.episodes} / {res.anime.episodes_total}
                            </td>
                            <td
                                className="hidden w-32 lg:table-cell"
                                align="center"
                            >
                                {
                                    MEDIA_TYPE[
                                        res.anime.media_type as Hikka.MediaType
                                    ].title_ua
                                }
                            </td>
                            <th className="w-20" align="center">
                                <div
                                    className={clsx(
                                        'radial-progress border border-secondary text-accent',
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
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
            {!go && slug && loggedUser?.username === params.username && (
                <WatchEditModal slug={slug} setSlug={setSlug} />
            )}
        </div>
    );
};

export default Component;
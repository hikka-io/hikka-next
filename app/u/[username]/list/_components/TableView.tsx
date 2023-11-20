'use client';

import { MEDIA_TYPE } from '@/utils/constants';
import WatchEditModal from '@/app/u/[username]/list/_layout/WatchEditModal';
import { CSSProperties, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import Image from '@/app/_components/Image';
import { useModalContext } from '@/utils/providers/ModalProvider';

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
    const queryClient = useQueryClient();
    const { setState: setModalState } = useModalContext();
    const { secret } = useAuthContext();
    const params = useParams();
    const [go, setGo] = useState(false);
    const [slug, setSlug] = useState<string | null>(null);

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    useEffect(() => {
        if (slug) {
            setModalState((prev) => ({ ...prev, animeSettings: true }));
        }
    }, [slug]);

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead className="bg-secondary/30 overflow-hidden rounded-lg">
                    <tr>
                        <th className="w-8">#</th>
                        <th>Деталі</th>
                        <th className="w-20" align="center">
                            Епізоди
                        </th>
                        <th
                            className="w-32 hidden lg:table-cell"
                            align="center"
                        >
                            Тип
                        </th>
                        <th className="w-20" align="center">
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
                                    'hover:bg-secondary/60 hover:cursor-pointer',
                            )}
                            onClick={() => !go && setSlug(res.anime.slug)}
                        >
                            <th className="w-8 text-neutral">{i + 1}</th>
                            <td>
                                <div className="flex gap-4">
                                    <div className="w-12 hidden lg:block">
                                        <div className="relative pt-[140%] w-full overflow-hidden rounded-md">
                                            <div className="absolute top-0 left-0">
                                                <Image
                                                    src={res.anime.poster}
                                                    alt="poster"
                                                    width="50"
                                                    height="50"
                                                    className="w-full h-full"
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
                                            <p className="text-neutral">
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
                                className="w-32 hidden lg:table-cell"
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
                                        'radial-progress text-accent border border-secondary',
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

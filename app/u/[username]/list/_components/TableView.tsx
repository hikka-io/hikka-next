'use client';

import { MEDIA_TYPE } from '@/utils/constants';
import { Response } from '@/utils/api/watch/getWatchList';
import WatchEditModal from "@/app/u/[username]/list/_layout/WatchEditModal";
import {useState} from "react";
import Link from 'next/link';
import {useAuthContext} from "@/utils/providers/AuthProvider";
import {useQuery} from "@tanstack/react-query";
import getLoggedUserInfo from "@/utils/api/user/getLoggedUserInfo";
import clsx from "clsx";
import {useParams} from "next/navigation";

interface Props {
    data: Response;
}

const Component = ({ data }: Props) => {
    const { secret } = useAuthContext();
    const params = useParams();
    const [go, setGo] = useState(false);
    const [slug, setSlug] = useState<string | null>(null);

    const { data: loggedUser } = useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: Boolean(secret),
    });

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead className="bg-secondary/30 overflow-hidden rounded-lg">
                    <tr>
                        <th className="w-8">#</th>
                        <th>Назва</th>
                        <th className="w-20" align="center">
                            Серії
                        </th>
                        <th className="w-32" align="center">
                            Тип
                        </th>
                        <th className="w-20" align="center">
                            Оцінка
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.list.map((res, i) => (
                        <tr key={res.reference} className={clsx(loggedUser?.username === params.username && "hover:bg-secondary/60 hover:cursor-pointer")} onClick={() => !go && setSlug(res.anime.slug)}>
                            <th className="w-8 text-neutral">{i + 1}</th>
                            <td>
                                <Link className="hover:underline" href={`/anime/${res.anime.slug}`} onClick={() => setGo(true)}>
                                    {res.anime.title_ua ||
                                        res.anime.title_en ||
                                        res.anime.title_ja}
                                </Link>
                            </td>
                            <td className="w-20" align="center">
                                {res.episodes} / {res.anime.episodes_total}
                            </td>
                            <td className="w-32" align="center">
                                {
                                    MEDIA_TYPE[
                                        res.anime.media_type as Hikka.MediaType
                                    ].title_ua
                                }
                            </td>
                            <th className="w-20" align="center">
                                <div className="rounded-full border border-secondary font-bold w-12 h-12 flex justify-center items-center">
                                    {res.score}
                                </div>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
            {!go && slug && loggedUser?.username === params.username && <WatchEditModal slug={slug} setSlug={setSlug} />}
        </div>
    );
};

export default Component;

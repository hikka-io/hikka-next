'use client';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Popper } from '@mui/base/Popper';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import Link from "next/link";
import {MEDIA_TYPE, RELEASE_STATUS} from "@/utils/constants";
import WatchListButton from "@/app/_components/WatchListButton";
import {useAuthContext} from "@/utils/providers/AuthProvider";

interface Props {
    anchor: HTMLElement | null;
    slug: string;
    setOnTooltip: Dispatch<SetStateAction<boolean>>;
}

export default function Component({ anchor, slug, setOnTooltip }: Props) {
    const { secret } = useAuthContext();
    const { data } = useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug: String(slug) }),
    });

    const open = Boolean(anchor);
    const id = open ? 'anime-tooltip' : undefined;

    if (!data) {
        return null;
    }

    const title = data.title_ua || data.title_en || data.title_ja;
    const synopsis = data.synopsis_ua || data.synopsis_en;

    return (
        <Popper
            className="hidden lg:block z-50"
            placement="right-start"
            onMouseOver={() => setOnTooltip(true)}
            onMouseOut={() => setOnTooltip(false)}
            id={id}
            open={open}
            anchorEl={anchor}
        >
            <div className="ml-4 flex flex-col gap-4 z-50 rounded-lg p-4 w-80 border border-solid border-secondary bg-black shadow-md">
                <div className="flex flex-col gap-2">
                    <h5>{title}</h5>
                    {synopsis && <p className="text-sm">
                        {synopsis.length > 150
                            ? synopsis.substring(
                                0,
                                150 + synopsis.substring(150).indexOf(' '),
                            )
                            : synopsis}
                        ...
                    </p>}
                    <div className="flex">
                        <div className="w-1/4">
                            <p className="label-text text-sm">Тип:</p>
                        </div>
                        <div className="flex-1 flex gap-2">
                            <p className="text-sm">{MEDIA_TYPE[data.media_type].title_ua}</p>
                            <div
                                className="rounded-md px-2 text-sm w-fit"
                                style={{
                                    backgroundColor:
                                    RELEASE_STATUS[data.status].color,
                                }}
                            >
                                <p>{RELEASE_STATUS[data.status].title_ua}</p>
                            </div>
                        </div>
                    </div>
                    {data.media_type !== 'movie' &&
                        data.episodes_total &&
                        data.episodes_released !== null && (
                            <div className="flex">
                                <div className="w-1/4">
                                    <p className="label-text text-sm">Епізоди:</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">
                                        {data.status === 'finished'
                                            ? data.episodes_total
                                            : `${data.episodes_released} / ${data.episodes_total}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    <div className="flex">
                        <div className="w-1/4">
                            <p className="label-text text-sm">Жанри:</p>
                        </div>
                        <div className="flex-1">
                            {data.genres.map((genre, i) => (
                                <span key={genre.slug}>
                                <Link
                                    className="text-sm rounded-sm underline decoration-accent decoration-dashed hover:bg-accent hover:text-accent-content transition-colors duration-100"
                                    href={`/anime?genres=${genre.slug}`}
                                >
                                    {genre.name_ua}
                                </Link>
                                    {i + 1 !== data.genres.length && (
                                        <span>, </span>
                                    )}
                            </span>
                            ))}
                        </div>
                    </div>
                </div>
                {secret && <WatchListButton slug={slug} additional />}
            </div>
        </Popper>
    );
}

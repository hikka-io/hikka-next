'use client';

import * as React from 'react';
import { PropsWithChildren, memo } from 'react';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';

import WatchListButton from '@/app/_components/WatchListButton';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';
import { useAuthContext } from '@/utils/providers/AuthProvider';

import Tooltip from './Tooltip';

interface Props extends PropsWithChildren {
    slug: string;
}

const TooltipData = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();
    const { data } = useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug: String(slug) }),
    });

    if (!data) {
        return (
            <div className="flex animate-pulse flex-col gap-4">
                <div className="flex justify-between gap-2">
                    <div className="h-4 flex-1 rounded-lg bg-secondary/60" />
                    <div className="h-4 w-10 rounded-lg bg-secondary/60" />
                </div>
                <div className="flex flex-col gap-2 py-3">
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-1/3 rounded-lg bg-secondary/60" />
                </div>
                <div className="flex gap-2">
                    <div className="h-3 w-1/4 rounded-lg bg-secondary/60" />
                    <div className="h-3 flex-1 rounded-lg bg-secondary/60" />
                </div>
                <div className="flex gap-2">
                    <div className="h-3 w-1/4 rounded-lg bg-secondary/60" />
                    <div className="h-3 w-2/4 rounded-lg bg-secondary/60" />
                </div>
                <div className="rounded-btn h-12 w-full bg-secondary/60" />
            </div>
        );
    }

    const title = data.title_ua || data.title_en || data.title_ja;
    const synopsis = data.synopsis_ua || data.synopsis_en;

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-2">
                    <h5>{title}</h5>
                    {data.score > 0 ? (
                        <div className="h-fit w-fit rounded-md  border border-accent bg-accent px-2 text-sm text-accent-content">
                            {data.score}
                        </div>
                    ) : null}
                </div>
                {synopsis && (
                    <p className="text-sm">
                        {synopsis.length > 150
                            ? synopsis.substring(
                                  0,
                                  150 + synopsis.substring(150).indexOf(' '),
                              )
                            : synopsis}
                        ...
                    </p>
                )}
                <div className="flex">
                    <div className="w-1/4">
                        <p className="label-text text-sm">Тип:</p>
                    </div>
                    <div className="flex flex-1 flex-wrap gap-2">
                        <p className="text-sm">
                            {MEDIA_TYPE[data.media_type].title_ua}
                        </p>
                        <div
                            className="w-fit rounded-md px-2 text-sm text-white"
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
                                    className="rounded-sm text-sm underline decoration-accent decoration-dashed transition-colors duration-100 hover:bg-accent hover:text-accent-content"
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
        </>
    );
};

const Component = ({ slug, children, ...props }: Props) => {
    return (
        <Tooltip
            placement="right-start"
            data={<TooltipData slug={slug} />}
            className="ml-4 flex w-80 flex-col gap-4 p-4"
        >
            {children}
        </Tooltip>
    );
};

export default memo(Component);

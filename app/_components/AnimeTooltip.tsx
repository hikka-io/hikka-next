'use client';
import * as React from 'react';
import { memo, PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import Link from 'next/link';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';
import WatchListButton from '@/app/_components/WatchListButton';
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
            <div className="flex flex-col gap-4 animate-pulse">
                <div className="flex gap-2 justify-between">
                    <div className="bg-secondary/60 h-4 flex-1 rounded-lg" />
                    <div className="bg-secondary/60 h-4 w-10 rounded-lg" />
                </div>
                <div className="flex flex-col gap-2 py-3">
                    <div className="bg-secondary/60 h-2 w-full rounded-lg" />
                    <div className="bg-secondary/60 h-2 w-full rounded-lg" />
                    <div className="bg-secondary/60 h-2 w-full rounded-lg" />
                    <div className="bg-secondary/60 h-2 w-full rounded-lg" />
                    <div className="bg-secondary/60 h-2 w-1/3 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    <div className="bg-secondary/60 h-3 rounded-lg w-1/4" />
                    <div className="bg-secondary/60 h-3 rounded-lg flex-1" />
                </div>
                <div className="flex gap-2">
                    <div className="bg-secondary/60 h-3 rounded-lg w-1/4" />
                    <div className="bg-secondary/60 h-3 rounded-lg w-2/4" />
                </div>
                <div className="bg-secondary/60 h-12 w-full rounded-btn" />
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
                        <div className="border text-sm h-fit  border-accent bg-accent text-accent-content rounded-md w-fit px-2">
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
                    <div className="flex-1 flex flex-wrap gap-2">
                        <p className="text-sm">
                            {MEDIA_TYPE[data.media_type].title_ua}
                        </p>
                        <div
                            className="rounded-md px-2 text-sm w-fit text-white"
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
        </>
    );
};

const Component = ({ slug, children, ...props }: Props) => {
    return (
        <Tooltip
            placement="right-start"
            data={<TooltipData slug={slug} />}
            className="ml-4 flex flex-col gap-4 w-80 p-4"
        >
            {children}
        </Tooltip>
    );
};

export default memo(Component);

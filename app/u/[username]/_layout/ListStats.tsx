'use client';

import { WATCH_STATUS } from '@/utils/constants';
import {useParams, usePathname} from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getWatchStats from '@/utils/api/watch/getWatchStats';
import clsx from 'clsx';
import { createElement } from 'react';
import Link from "next/link";

interface Props {}

const Component = ({}: Props) => {
    const pathname = usePathname();
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['watchStats', params.username],
        queryFn: () => getWatchStats({ username: String(params.username) }),
        staleTime: 0,
    });

    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="stats bg-transparent flex border-y lg:border border-secondary/60 rounded-none lg:rounded-lg p-0 lg:mx-0 -mx-4">
                {Object.keys(data).map((status) => {
                    return (
                        <Link
                            href={`${pathname}/list?status=${status}`}
                            key={status}
                            className={clsx(
                                'stat p-4 flex-1 min-w-[50%] md:min-w-[25%] lg:min-w-fit text-left bg-secondary/30 transition',
                                'hover:bg-secondary/10',
                            )}
                        >
                            <div className="stat-title text-inherit">
                                {WATCH_STATUS[status as Hikka.WatchStatus]
                                    .title_ua ||
                                    WATCH_STATUS[status as Hikka.WatchStatus]
                                        .title_en}
                            </div>
                            <div className="grid">
                                <div className="stat-value font-bold">
                                    {data[status as Hikka.WatchStatus]}
                                </div>
                                <div className="stat-figure text-xl p-1 text-white rounded-md bg-secondary">
                                    {createElement(
                                        WATCH_STATUS[
                                            status as Hikka.WatchStatus
                                        ].icon,
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Component;

'use client';

import clsx from 'clsx';
import { createElement } from 'react';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import getWatchStats from '@/utils/api/watch/getWatchStats';
import { WATCH_STATUS } from '@/utils/constants';

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
            <div className="stats -mx-4 flex rounded-none border-y border-secondary/60 bg-transparent p-0 lg:mx-0 lg:rounded-lg lg:border">
                {Object.keys(data).map((status) => {
                    return (
                        <Link
                            href={`${pathname}/list?status=${status}`}
                            key={status}
                            className={clsx(
                                'stat min-w-[50%] flex-1 bg-secondary/30 p-4 text-left transition md:min-w-[25%] lg:min-w-fit',
                                'hover:bg-secondary/10',
                            )}
                        >
                            <div className="stat-title">
                                {WATCH_STATUS[status as Hikka.WatchStatus]
                                    .title_ua ||
                                    WATCH_STATUS[status as Hikka.WatchStatus]
                                        .title_en}
                            </div>
                            <div className="grid">
                                <div className="stat-value font-display">
                                    {data[status as Hikka.WatchStatus]}
                                </div>
                                <div className="stat-figure rounded-md bg-secondary p-1 text-xl">
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

'use client';

import clsx from 'clsx';
import { createElement } from 'react';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import getWatchStats from '@/app/_utils/api/watch/getWatchStats';
import { WATCH_STATUS } from '@/app/_utils/constants';
import { Label } from '@/app/_components/ui/label';

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
        <div className="flex gap-4 overflow-x-scroll no-scrollbar -mx-4 md:mx-0 px-4 md:px-0">
            {Object.keys(data).map((status) => {
                if (!(status in WATCH_STATUS)) {
                    return null;
                }

                return (
                    <Link
                        href={`${pathname}/list?status=${status}`}
                        key={status}
                        className={clsx(
                            'flex-1 bg-secondary/30 border backdrop-blur border-secondary/60 p-4 text-left transition lg:min-w-fit rounded-lg',
                            'hover:bg-secondary/10',
                        )}
                    >
                        <div className="flex justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 bg-secondary rounded-full"
                                    style={{
                                        backgroundColor:
                                            WATCH_STATUS[
                                                status as Hikka.WatchStatus
                                            ].color,
                                    }}
                                />
                                <Label className="text-muted-foreground">
                                    {WATCH_STATUS[status as Hikka.WatchStatus]
                                        .title_ua ||
                                        WATCH_STATUS[
                                            status as Hikka.WatchStatus
                                        ].title_en}
                                </Label>
                            </div>
                            <div className="stat-figure text-lg !text-neutral">
                                {createElement(
                                    WATCH_STATUS[status as Hikka.WatchStatus]
                                        .icon,
                                )}
                            </div>
                        </div>
                        <h2 className="text-4xl font-display">
                            {data[status as Hikka.WatchStatus]}
                        </h2>
                    </Link>
                );
            })}
        </div>
    );
};

export default Component;
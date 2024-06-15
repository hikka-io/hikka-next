'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Label } from '@/components/ui/label';
import RadialProgress from '@/components/ui/radial-progress';

import useReadStatus from '@/services/hooks/read/use-read-stats';
import { READ_STATUS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface Props {
    content_type: 'manga' | 'novel';
}

const ReadlistStats: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { data } = useReadStatus({
        username: String(params.username),
        content_type,
    });

    if (!data) {
        return null;
    }

    const sum = Object.values({ ...data, duration: 0 }).reduce(
        (acc, cur) => acc + cur,
        0,
    );

    return (
        <div className="flex h-fit w-full items-center gap-2 rounded-md border border-secondary/60 bg-secondary/30 p-2 backdrop-blur">
            <Link
                href={`/u/${params.username}/list/${content_type}?status=completed`}
                className="flex flex-col items-center gap-2 rounded-md p-2 hover:cursor-pointer hover:bg-secondary/60"
            >
                <RadialProgress
                    style={{
                        color: READ_STATUS.completed.color,
                    }}
                    thickness={8}
                    value={(data.completed * 100) / sum}
                >
                    {data.completed}
                </RadialProgress>
                <Label className="text-muted-foreground">Завершено</Label>
            </Link>
            <div className="no-scrollbar flex w-full flex-1 flex-col gap-0 overflow-x-scroll">
                {Object.keys(data).map((status) => {
                    if (status === 'completed' || !(status in READ_STATUS)) {
                        return null;
                    }

                    return (
                        <Link
                            href={`/u/${params.username}/list/${content_type}?status=${status}`}
                            key={status}
                            className={cn(
                                'rounded-md p-2 hover:cursor-pointer hover:bg-secondary/60',
                            )}
                        >
                            <div className="flex justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-2">
                                    <div
                                        className="size-2 rounded-full bg-secondary"
                                        style={{
                                            backgroundColor:
                                                READ_STATUS[
                                                    status as API.ReadStatus
                                                ].color,
                                        }}
                                    />
                                    <Label className="cursor-pointer truncate text-muted-foreground">
                                        {READ_STATUS[status as API.ReadStatus]
                                            .title_ua ||
                                            READ_STATUS[
                                                status as API.ReadStatus
                                            ].title_en}
                                    </Label>
                                </div>
                                <Label className="cursor-pointer">
                                    {data[status as API.ReadStatus]}
                                </Label>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ReadlistStats;

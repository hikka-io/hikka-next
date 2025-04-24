'use client';

import { ReadContentType, ReadStatusEnum } from '@hikka/client';
import { useReadStats } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Label } from '@/components/ui/label';
import RadialProgress from '@/components/ui/radial-progress';

import { READ_STATUS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

interface Props {
    content_type: ReadContentType;
}

const ReadlistStats: FC<Props> = ({ content_type }) => {
    const params = useParams();
    const { data } = useReadStats({
        username: String(params.username),
        contentType: content_type,
    });

    if (!data) {
        return null;
    }

    const sum = Object.values({ ...data, duration: 0 }).reduce(
        (acc, cur) => acc + cur,
        0,
    );

    return (
        <div className="border-border bg-secondary/20 flex h-fit w-full items-center gap-2 rounded-md border p-2 backdrop-blur">
            <Link
                href={`/u/${params.username}/list/${content_type}?status=completed&sort=read_score`}
                className="hover:bg-secondary/20 flex flex-col items-center gap-2 rounded-md p-2 hover:cursor-pointer"
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
                            href={`/u/${params.username}/list/${content_type}?status=${status}&sort=read_score`}
                            key={status}
                            className={cn(
                                'hover:bg-secondary/20 rounded-md p-2 hover:cursor-pointer',
                            )}
                        >
                            <div className="flex justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-2">
                                    <div
                                        className="bg-secondary/20 size-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                READ_STATUS[
                                                    status as ReadStatusEnum
                                                ].color,
                                        }}
                                    />
                                    <Label className="text-muted-foreground cursor-pointer truncate">
                                        {READ_STATUS[status as ReadStatusEnum]
                                            .title_ua ||
                                            READ_STATUS[
                                                status as ReadStatusEnum
                                            ].title_en}
                                    </Label>
                                </div>
                                <Label className="cursor-pointer">
                                    {data[status as ReadStatusEnum]}
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

'use client';

import MaterialSymbolsOpenInNewRounded from '~icons/material-symbols/open-in-new-rounded';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useWatchStats } from '@/app/(pages)/u/[username]/page.hooks';
import { Label } from '@/components/ui/label';
import RadialProgress from '@/components/ui/radial-progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils';
import { WATCH_STATUS } from '@/utils/constants';

interface Props {}

const Component = ({}: Props) => {
    const params = useParams();
    const { data } = useWatchStats(String(params.username));

    if (!data) {
        return null;
    }

    const sum = Object.values({ ...data, duration: 0 }).reduce(
        (acc, cur) => acc + cur,
        0,
    );

    return (
        <div className="flex flex-col gap-2">
            <Tabs value="anime" className="overflow-hidden w-full">
                <TabsList className="w-full items-center justify-start no-scrollbar bg-secondary/80 border border-secondary/60 backdrop-blur">
                    <TabsTrigger value="anime" className="gap-2">
                        Аніме{' '}
                        <Link href={`/u/${params.username}/list`}>
                            <MaterialSymbolsOpenInNewRounded />
                        </Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex gap-2 w-full h-fit items-center rounded-md bg-secondary/30 border backdrop-blur border-secondary/60 p-2">
                <Link
                    href={`/u/${params.username}/list?status=completed`}
                    className="flex flex-col gap-2 items-center p-2 rounded-md hover:bg-secondary/60 hover:cursor-pointer"
                >
                    <RadialProgress
                        style={{
                            color: WATCH_STATUS.completed.color,
                        }}
                        thickness={8}
                        value={(data.completed * 100) / sum}
                    >
                        {data.completed}
                    </RadialProgress>
                    <Label className="text-muted-foreground">Завершено</Label>
                </Link>
                <div className="flex flex-1 flex-col gap-0 w-full overflow-x-scroll no-scrollbar">
                    {Object.keys(data).map((status) => {
                        if (
                            status === 'completed' ||
                            !(status in WATCH_STATUS)
                        ) {
                            return null;
                        }

                        return (
                            <Link
                                href={`/u/${params.username}/list?status=${status}`}
                                key={status}
                                className={cn(
                                    'rounded-md p-2 hover:bg-secondary/60 hover:cursor-pointer',
                                )}
                            >
                                <div className="flex justify-between gap-4">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div
                                            className="w-2 h-2 bg-secondary rounded-full"
                                            style={{
                                                backgroundColor:
                                                    WATCH_STATUS[
                                                        status as Hikka.WatchStatus
                                                    ].color,
                                            }}
                                        />
                                        <Label className="text-muted-foreground truncate cursor-pointer">
                                            {WATCH_STATUS[
                                                status as Hikka.WatchStatus
                                            ].title_ua ||
                                                WATCH_STATUS[
                                                    status as Hikka.WatchStatus
                                                ].title_en}
                                        </Label>
                                    </div>
                                    <Label className="cursor-pointer">
                                        {data[status as Hikka.WatchStatus]}
                                    </Label>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Component;
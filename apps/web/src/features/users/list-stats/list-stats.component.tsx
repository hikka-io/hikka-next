'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useUserWatchStats } from '@hikka/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import MaterialSymbolsOpenInNewRounded from '@/components/icons/material-symbols/MaterialSymbolsOpenInNewRounded';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ReadlistStats from './readlist-stats';
import WatchlistStats from './watchlist-stats';

const ListStats = () => {
    const params = useParams();
    const { data } = useUserWatchStats({ username: String(params.username) });

    if (!data) {
        return null;
    }

    return (
        <Tabs
            defaultValue="anime"
            className="flex w-full flex-col gap-2 overflow-hidden"
        >
            <TabsList className="no-scrollbar border-border bg-secondary/20 w-full items-center justify-start border backdrop-blur">
                <TabsTrigger value="anime" className="flex-1 gap-2">
                    Аніме{' '}
                    <Link
                        href={`/u/${params.username}/list/anime?status=planned&sort=watch_score`}
                    >
                        <MaterialSymbolsOpenInNewRounded />
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="manga" className="flex-1 gap-2">
                    Манґа{' '}
                    <Link
                        href={`/u/${params.username}/list/manga?status=planned&sort=read_score`}
                    >
                        <MaterialSymbolsOpenInNewRounded />
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="novel" className="flex-1 gap-2">
                    Ранобе{' '}
                    <Link
                        href={`/u/${params.username}/list/novel?status=planned&sort=read_score`}
                    >
                        <MaterialSymbolsOpenInNewRounded />
                    </Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="anime">
                <WatchlistStats />
            </TabsContent>
            <TabsContent value="manga">
                <ReadlistStats content_type={ContentTypeEnum.MANGA} />
            </TabsContent>
            <TabsContent value="novel">
                <ReadlistStats content_type={ContentTypeEnum.NOVEL} />
            </TabsContent>
        </Tabs>
    );
};

export default ListStats;

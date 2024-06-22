'use client';

import { TabsContent } from '@radix-ui/react-tabs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MaterialSymbolsOpenInNewRounded from '~icons/material-symbols/open-in-new-rounded';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useWatchStats from '@/services/hooks/watch/use-watch-stats';

import ReadlistStats from './readlist-stats';
import WatchlistStats from './watchlist-stats';

const ListStats = () => {
    const params = useParams();
    const { data } = useWatchStats({ username: String(params.username) });

    if (!data) {
        return null;
    }

    return (
        <Tabs
            defaultValue="anime"
            className="flex w-full flex-col gap-2 overflow-hidden"
        >
            <TabsList className="no-scrollbar w-full items-center justify-start border border-secondary/60 bg-secondary/80 backdrop-blur">
                <TabsTrigger value="anime" className="flex-1 gap-2">
                    Аніме{' '}
                    <Link
                        href={`/u/${params.username}/list/anime?status=planned&sort=watch_score`}
                    >
                        <MaterialSymbolsOpenInNewRounded />
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="manga" className="flex-1 gap-2">
                    Манга{' '}
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
                <ReadlistStats content_type="manga" />
            </TabsContent>
            <TabsContent value="novel">
                <ReadlistStats content_type="novel" />
            </TabsContent>
        </Tabs>
    );
};

export default ListStats;

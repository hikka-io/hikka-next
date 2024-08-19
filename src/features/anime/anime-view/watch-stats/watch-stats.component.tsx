import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Score from './score';
import Watchlist from './watchlist';

const WatchStats = () => {
    return (
        <Block>
            <Header title="Статистика">
                <ToggleGroup type="single" value="MAL" size="badge">
                    <ToggleGroupItem value="MAL" aria-label="MAL">
                        MAL
                    </ToggleGroupItem>
                </ToggleGroup>
            </Header>
            <Tabs defaultValue="watchlist">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="watchlist">У списках</TabsTrigger>
                    <TabsTrigger value="score">Оцінки</TabsTrigger>
                </TabsList>
                <TabsContent value="watchlist">
                    <Watchlist />
                </TabsContent>
                <TabsContent value="score">
                    <Score />
                </TabsContent>
            </Tabs>
        </Block>
    );
};

export default WatchStats;

import SubHeader from '@/components/sub-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Score from './components/score';
import Watchlist from './components/watchlist';

const WatchStats = () => {
    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Статистика">
                <ToggleGroup
                    type="single"
                    value="MAL"
                    variant="outline"
                    size="badge"
                >
                    <ToggleGroupItem value="MAL" aria-label="MAL">
                        MAL
                    </ToggleGroupItem>
                </ToggleGroup>
            </SubHeader>
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
        </div>
    );
};

export default WatchStats;

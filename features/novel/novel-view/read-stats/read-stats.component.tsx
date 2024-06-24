import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Readlist from './readlist';
import Score from './score';

const ReadStats = () => {
    return (
        <Block>
            <Header title="Статистика">
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
            </Header>
            <Tabs defaultValue="readlist">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="readlist">У списках</TabsTrigger>
                    <TabsTrigger value="score">Оцінки</TabsTrigger>
                </TabsList>
                <TabsContent value="readlist">
                    <Readlist />
                </TabsContent>
                <TabsContent value="score">
                    <Score />
                </TabsContent>
            </Tabs>
        </Block>
    );
};

export default ReadStats;

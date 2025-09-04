import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Readlist from './components/read-stats/readlist';
import Score from './components/read-stats/score';

const ReadStats = () => {
    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle>Статистика</HeaderTitle>
                    <ToggleGroup type="single" value="MAL" size="badge">
                        <ToggleGroupItem value="MAL" aria-label="MAL">
                            MAL
                        </ToggleGroupItem>
                    </ToggleGroup>
                </HeaderContainer>
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

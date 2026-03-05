import { ContentTypeEnum } from '@hikka/client';

import Block from '@/components/ui/block';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Card from '@/components/ui/card';
import Readlist from './components/readlist';
import Score from './components/score';
import Watchlist from './components/watchlist';

interface Props {
    content_type:
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;
}

const ContentStats = ({ content_type }: Props) => {
    const defaultValue =
        content_type === ContentTypeEnum.ANIME ? 'watchlist' : 'readlist';

    return (
        <Card className='bg-secondary/20'>
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant='h4'>Статистика</HeaderTitle>
                        <ToggleGroup type="single" value="MAL" size="badge">
                            <ToggleGroupItem value="MAL" aria-label="MAL">
                                MAL
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <Tabs defaultValue={defaultValue}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value={defaultValue}>У списках</TabsTrigger>
                        <TabsTrigger value="score">Оцінки</TabsTrigger>
                    </TabsList>
                    {content_type !== ContentTypeEnum.ANIME && (
                        <TabsContent value="readlist">
                            <Readlist
                                content_type={
                                    content_type as
                                    | ContentTypeEnum.MANGA
                                    | ContentTypeEnum.NOVEL
                                }
                            />
                        </TabsContent>
                    )}
                    {content_type === ContentTypeEnum.ANIME && (
                        <TabsContent value="watchlist">
                            <Watchlist />
                        </TabsContent>
                    )}
                    <TabsContent value="score">
                        <Score content_type={content_type} />
                    </TabsContent>
                </Tabs>
            </Block>
        </Card>
    );
};

export default ContentStats;

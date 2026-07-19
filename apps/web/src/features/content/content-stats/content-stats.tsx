import { useState } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { Badge } from '@/components/ui/badge';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Readlist from './components/readlist';
import Score from './components/score';
import Watchlist from './components/watchlist';

type Props = {
    content_type: MainContentTypeEnum;
};

const ContentStats = ({ content_type }: Props) => {
    const defaultValue =
        content_type === ContentTypeEnum.ANIME ? 'watchlist' : 'readlist';
    const [stat, setStat] = useState(defaultValue);

    return (
        <Card id="content-stats">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Статистика</HeaderTitle>
                        <Badge variant="secondary">MAL</Badge>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <Tabs value={stat} onValueChange={setStat}>
                    <TabsList size="sm" className="w-full">
                        <TabsTrigger value={defaultValue}>
                            У списках
                        </TabsTrigger>
                        <TabsTrigger value="score">Оцінки</TabsTrigger>
                    </TabsList>
                </Tabs>
                {stat === 'readlist' && (
                    <Readlist
                        content_type={content_type as 'manga' | 'novel'}
                    />
                )}
                {stat === 'watchlist' && <Watchlist />}
                {stat === 'score' && <Score content_type={content_type} />}
            </Block>
        </Card>
    );
};

export default ContentStats;

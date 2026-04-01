import { ContentTypeEnum } from '@hikka/client';
import { useState } from 'react';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    const [stat, setStat] = useState(defaultValue);

    return (
        <Card className="bg-secondary/20">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Статистика</HeaderTitle>
                        <ToggleGroup type="single" value="MAL" size="badge">
                            <ToggleGroupItem value="MAL" aria-label="MAL">
                                MAL
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <ToggleGroup
                    type="single"
                    size="badge"
                    onValueChange={(value) => setStat(value)}
                    value={stat}
                >
                    <ToggleGroupItem value={defaultValue} className="flex-1">
                        У списках
                    </ToggleGroupItem>
                    <ToggleGroupItem value="score" className="flex-1">
                        Оцінки
                    </ToggleGroupItem>
                </ToggleGroup>
                {stat === 'readlist' && (
                    <Readlist
                        content_type={
                            content_type as
                                | ContentTypeEnum.MANGA
                                | ContentTypeEnum.NOVEL
                        }
                    />
                )}
                {stat === 'watchlist' && <Watchlist />}
                {stat === 'score' && <Score content_type={content_type} />}
            </Block>
        </Card>
    );
};

export default ContentStats;

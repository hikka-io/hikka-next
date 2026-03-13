'use client';

import { CommonContentType, ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
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

import ReadingTracker from './components/reading-tracker';
import WatchingTracker from './components/watching-tracker';

const TAB_LIST_HREFS: Record<CommonContentType, string> = {
    [ContentTypeEnum.ANIME]: 'list/anime?status=planned&sort=watch_score',
    [ContentTypeEnum.MANGA]: 'list/manga?status=planned&sort=read_score',
    [ContentTypeEnum.NOVEL]: 'list/novel?status=planned&sort=read_score',
};

const WidgetTracker = () => {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );

    if (!user) return null;

    return (
        <Card className="backdrop-blur bg-secondary/20 snap-center">
            <Block>
                <Header
                    href={`/u/${user.username}/${TAB_LIST_HREFS[activeTab]}`}
                >
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Мій список</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <ToggleGroup
                    type="single"
                    value={activeTab}
                    onValueChange={(value: string) =>
                        value && setActiveTab(value as CommonContentType)
                    }
                    size="badge"
                >
                    <ToggleGroupItem
                        value={ContentTypeEnum.ANIME}
                        aria-label="Аніме"
                        className="flex-1"
                    >
                        Аніме
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value={ContentTypeEnum.MANGA}
                        aria-label="Манґа"
                        className="flex-1"
                    >
                        Манґа
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value={ContentTypeEnum.NOVEL}
                        aria-label="Ранобе"
                        className="flex-1"
                    >
                        Ранобе
                    </ToggleGroupItem>
                </ToggleGroup>
                {activeTab === ContentTypeEnum.ANIME && <WatchingTracker />}
                {activeTab === ContentTypeEnum.MANGA && (
                    <ReadingTracker contentType={ContentTypeEnum.MANGA} />
                )}
                {activeTab === ContentTypeEnum.NOVEL && (
                    <ReadingTracker contentType={ContentTypeEnum.NOVEL} />
                )}
            </Block>
        </Card>
    );
};

export default WidgetTracker;

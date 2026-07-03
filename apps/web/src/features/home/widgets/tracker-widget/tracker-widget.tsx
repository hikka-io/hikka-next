import { type FC, useState } from 'react';

import { ContentTypeEnum, ReadStatusEnum, WatchStatusEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSession } from '@/features/auth/hooks/use-session';

import type { WidgetProps } from '../../constants';
import ReadingTracker from './components/reading-tracker';
import WatchingTracker from './components/watching-tracker';

// @hikka/api has no CommonContentType enum; this local union covers the content types this widget handles.
type CommonContentType =
    | typeof ContentTypeEnum.ANIME
    | typeof ContentTypeEnum.MANGA
    | typeof ContentTypeEnum.NOVEL;

const TAB_LIST_CONFIG: Record<
    CommonContentType,
    { path: string; search: Record<string, string> }
> = {
    [ContentTypeEnum.ANIME]: {
        path: 'list/anime',
        search: { status: WatchStatusEnum.WATCHING, sort: 'watch_score' },
    },
    [ContentTypeEnum.MANGA]: {
        path: 'list/manga',
        search: { status: ReadStatusEnum.READING, sort: 'read_score' },
    },
    [ContentTypeEnum.NOVEL]: {
        path: 'list/novel',
        search: { status: ReadStatusEnum.READING, sort: 'read_score' },
    },
};

const TrackerWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );

    if (!user) return null;

    return (
        <Card id="tracker">
            <Block>
                <Header
                    href={`/u/${user.username}/${TAB_LIST_CONFIG[activeTab].path}`}
                    search={TAB_LIST_CONFIG[activeTab].search}
                >
                    <HeaderContainer>
                        <HeaderTitle variant="h4">
                            {activeTab === ContentTypeEnum.ANIME
                                ? 'Дивлюсь'
                                : 'Читаю'}
                        </HeaderTitle>
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

export default TrackerWidget;

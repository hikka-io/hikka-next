import { type FC, useEffect, useState } from 'react';

import { ContentTypeEnum, ReadStatusEnum, WatchStatusEnum } from '@hikka/api';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/services/session';

import type { WidgetProps } from '../../types';
import ReadingTracker from './components/reading-tracker';
import WatchingTracker from './components/watching-tracker';
import { Button } from '@/components/ui/button';

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

const HIDE_ONGOINGS_KEY = 'tracker:hide-ongoings';

function useHideOngoings(username: string) {
    const [hideOngoings, setHideOngoings] = useState(false);

    useEffect(() => {
        try {
            setHideOngoings(
                localStorage.getItem(`${HIDE_ONGOINGS_KEY}:${username}`) ===
                    '1',
            );
        } catch {
            setHideOngoings(false);
        }
    }, [username]);

    const setAndPersist = (next: boolean) => {
        setHideOngoings(next);
        try {
            localStorage.setItem(
                `${HIDE_ONGOINGS_KEY}:${username}`,
                next ? '1' : '0',
            );
        } catch {
            // private mode etc. — keep in-memory state only
        }
    };

    return [hideOngoings, setAndPersist] as const;
}

const TrackerWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );

    const [hideOngoings, setHideOngoings] = useHideOngoings(
        user?.username ?? '',
    );

    if (!user) return null;

    return (
        <Card
            id="tracker"
            className="p-0 overflow-hidden divide-y divide-border gap-0"
        >
            <Block className="p-4">
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
                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as CommonContentType)
                    }
                >
                    <TabsList size="sm" className="w-full">
                        <TabsTrigger
                            value={ContentTypeEnum.ANIME}
                            aria-label="Аніме"
                        >
                            Аніме
                        </TabsTrigger>
                        <TabsTrigger
                            value={ContentTypeEnum.MANGA}
                            aria-label="Манґа"
                        >
                            Манґа
                        </TabsTrigger>
                        <TabsTrigger
                            value={ContentTypeEnum.NOVEL}
                            aria-label="Ранобе"
                        >
                            Ранобе
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                {activeTab === ContentTypeEnum.ANIME && (
                    <WatchingTracker
                        hideOngoings={hideOngoings}
                        onClearHideOngoings={() => setHideOngoings(false)}
                    />
                )}
                {activeTab === ContentTypeEnum.MANGA && (
                    <ReadingTracker
                        contentType={ContentTypeEnum.MANGA}
                        hideOngoings={hideOngoings}
                        onClearHideOngoings={() => setHideOngoings(false)}
                    />
                )}
                {activeTab === ContentTypeEnum.NOVEL && (
                    <ReadingTracker
                        contentType={ContentTypeEnum.NOVEL}
                        hideOngoings={hideOngoings}
                        onClearHideOngoings={() => setHideOngoings(false)}
                    />
                )}
            </Block>
            <Button
                variant="ghost"
                className="text-muted-foreground text-left rounded-none"
                render={<label />}
            >
                <MaterialSymbolsCalendarClockRounded className="size-4 shrink-0" />
                <span className="flex-1">Приховати онґоїнґи</span>
                <Switch
                    checked={hideOngoings}
                    onCheckedChange={setHideOngoings}
                />
            </Button>
        </Card>
    );
};

export default TrackerWidget;

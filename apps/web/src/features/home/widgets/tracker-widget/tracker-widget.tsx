import { type FC, useState } from 'react';

import {
    ContentStatusEnum,
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/api';

import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import Block from '@/components/ui/block';
import BlockFooter from '@/components/ui/block-footer';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/services/session';
import { useUiPreferences } from '@/services/ui-preferences-store';

import type { WidgetProps } from '../../types';
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

const HIDDEN_STATUSES_KEY = 'trackerHiddenStatuses';

const TrackerWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );

    const hideOngoings = useUiPreferences(
        (state) =>
            state.filters[HIDDEN_STATUSES_KEY]?.includes(
                ContentStatusEnum.ONGOING,
            ) ?? false,
    );
    const setFilter = useUiPreferences((state) => state.setFilter);
    const setHideOngoings = (hide: boolean) =>
        setFilter(HIDDEN_STATUSES_KEY, hide ? [ContentStatusEnum.ONGOING] : []);

    if (!user) return null;

    return (
        <Block variant="card" id="tracker">
            <Header>
                <HeaderTitle
                    to={`/u/${user.username}/${TAB_LIST_CONFIG[activeTab].path}`}
                    search={TAB_LIST_CONFIG[activeTab].search}
                >
                    {activeTab === ContentTypeEnum.ANIME ? 'Дивлюсь' : 'Читаю'}
                </HeaderTitle>
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
            <BlockFooter className="gap-2 text-muted-foreground">
                <MaterialSymbolsCalendarClockRounded className="size-4 shrink-0" />
                <Label htmlFor="tracker-hide-ongoings" className="flex-1">
                    Приховати онґоїнґи
                </Label>
                <Switch
                    id="tracker-hide-ongoings"
                    checked={hideOngoings}
                    onCheckedChange={setHideOngoings}
                />
            </BlockFooter>
        </Block>
    );
};

export default TrackerWidget;

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from '@/utils/navigation';

import { userListStatsOptions } from '../../queries';
import ListTabContent from './list-tab-content';

type ListContentType = MainContentTypeEnum;

const TAB_LIST_CONFIG: Record<
    ListContentType,
    { path: string; search: Record<string, string> }
> = {
    [ContentTypeEnum.ANIME]: {
        path: 'list/anime',
        search: { status: 'planned', sort: 'watch_score' },
    },
    [ContentTypeEnum.MANGA]: {
        path: 'list/manga',
        search: { status: 'planned', sort: 'read_score' },
    },
    [ContentTypeEnum.NOVEL]: {
        path: 'list/novel',
        search: { status: 'planned', sort: 'read_score' },
    },
};

const UserListStats = () => {
    const params = useParams();
    const username = String(params.username);
    const [activeTab, setActiveTab] = useState<ListContentType>(
        ContentTypeEnum.ANIME,
    );
    const tabConfig = TAB_LIST_CONFIG[activeTab];
    const queryClient = useQueryClient();

    const warmStats = (content_type: MainContentTypeEnum) => () =>
        queryClient.prefetchQuery(userListStatsOptions(username, content_type));

    return (
        <Card className="p-0 py-4" id="user-list-stats">
            <Header
                href={`/u/${username}/${tabConfig.path}`}
                search={tabConfig.search}
                className="px-4"
            >
                <HeaderContainer>
                    <HeaderTitle variant="h4">Список</HeaderTitle>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) =>
                            setActiveTab(value as ListContentType)
                        }
                    >
                        <TabsList size="sm">
                            <TabsTrigger
                                value={ContentTypeEnum.ANIME}
                                aria-label="Аніме"
                            >
                                Аніме
                            </TabsTrigger>
                            <TabsTrigger
                                value={ContentTypeEnum.MANGA}
                                onPointerEnter={warmStats(
                                    ContentTypeEnum.MANGA,
                                )}
                                onFocus={warmStats(ContentTypeEnum.MANGA)}
                                aria-label="Манґа"
                            >
                                Манґа
                            </TabsTrigger>
                            <TabsTrigger
                                value={ContentTypeEnum.NOVEL}
                                onPointerEnter={warmStats(
                                    ContentTypeEnum.NOVEL,
                                )}
                                onFocus={warmStats(ContentTypeEnum.NOVEL)}
                                aria-label="Ранобе"
                            >
                                Ранобе
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <ListTabContent type={activeTab} username={username} />
        </Card>
    );
};

export default UserListStats;

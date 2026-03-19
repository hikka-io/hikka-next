'use client';

import { CommonContentType, ContentTypeEnum } from '@hikka/client';
import { useState } from 'react';

import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useParams } from '@/utils/navigation';

import ListTabContent from './components/list-tab-content';

const TAB_LIST_CONFIG: Record<
    CommonContentType,
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
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );
    const tabConfig = TAB_LIST_CONFIG[activeTab];

    return (
        <Card className="bg-secondary/20 p-0 py-4">
            <Header
                href={`/u/${username}/${tabConfig.path}`}
                search={tabConfig.search}
                className="px-4"
            >
                <HeaderContainer>
                    <HeaderTitle variant="h4">Список</HeaderTitle>
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
                        >
                            Аніме
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value={ContentTypeEnum.MANGA}
                            aria-label="Манґа"
                        >
                            Манґа
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value={ContentTypeEnum.NOVEL}
                            aria-label="Ранобе"
                        >
                            Ранобе
                        </ToggleGroupItem>
                    </ToggleGroup>
                </HeaderContainer>
                <HeaderNavButton />
            </Header>
            <ListTabContent type={activeTab} username={username} />
        </Card>
    );
};

export default UserListStats;

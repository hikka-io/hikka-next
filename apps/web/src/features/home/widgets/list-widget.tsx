import { type FC, useState } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import Block from '@/components/ui/block';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTabContent } from '@/features/users';
import { useSession } from '@/services/session';

import type { WidgetProps } from '../types';

// @hikka/api has no CommonContentType enum; this local union covers the content types this widget handles.
type CommonContentType =
    | typeof ContentTypeEnum.ANIME
    | typeof ContentTypeEnum.MANGA
    | typeof ContentTypeEnum.NOVEL;

const ListWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );

    if (!user) return null;

    return (
        <Block variant="card" id="sidebar-list-stats">
            <Header>
                <HeaderTitle>Список</HeaderTitle>
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
            <ListTabContent type={activeTab} username={user.username} />
        </Block>
    );
};

export default ListWidget;

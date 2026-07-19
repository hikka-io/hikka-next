import { type FC, useState } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/features/auth/hooks/use-session';
import { ListTabContent } from '@/features/users/profile/user-list-stats';

import type { WidgetProps } from '../constants';

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
        <Card className="px-2" id="sidebar-list-stats">
            <Header className="px-2">
                <HeaderTitle variant="h4">Список</HeaderTitle>
            </Header>
            <Tabs
                value={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as CommonContentType)
                }
                className="mx-2"
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
            <ListTabContent
                type={activeTab}
                username={user.username}
                className="-mx-2"
            />
        </Card>
    );
};

export default ListWidget;

'use client';

import { CommonContentType, ContentTypeEnum } from '@hikka/client';
import { useSession } from '@hikka/react';
import { useState } from 'react';

import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { ListTabContent } from '@/features/users/profile/user-list-stats';

const ListWidget = () => {
    const { user } = useSession();
    const [activeTab, setActiveTab] = useState<CommonContentType>(
        ContentTypeEnum.ANIME,
    );

    if (!user) return null;

    return (
        <Card
            className="bg-secondary/20 px-2 backdrop-blur"
            id="sidebar-list-stats"
        >
            <Header className="px-2">
                <HeaderTitle variant="h4">Список</HeaderTitle>
            </Header>
            <ToggleGroup
                type="single"
                value={activeTab}
                onValueChange={(value: string) =>
                    value && setActiveTab(value as CommonContentType)
                }
                size="badge"
                className="mx-2"
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
            <ListTabContent
                type={activeTab}
                username={user.username}
                className="-mx-2"
            />
        </Card>
    );
};

export default ListWidget;

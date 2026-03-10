'use client';

import { useParams } from '@/utils/navigation';
import { useState } from 'react';

import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import Card from '@/components/ui/card';
import { CommonContentType, ContentTypeEnum } from '@hikka/client';
import ListTabContent from './components/list-tab-content';


const TAB_LIST_HREFS: Record<CommonContentType, string> = {
    [ContentTypeEnum.ANIME]: 'list/anime?status=planned&sort=watch_score',
    [ContentTypeEnum.MANGA]: 'list/manga?status=planned&sort=read_score',
    [ContentTypeEnum.NOVEL]: 'list/novel?status=planned&sort=read_score',
};

const UserListStats = () => {
    const params = useParams();
    const username = String(params.username);
    const [activeTab, setActiveTab] = useState<CommonContentType>(ContentTypeEnum.ANIME);

    return (
        <Card className="bg-secondary/20 p-0 py-4">
            <Header href={`/u/${username}/${TAB_LIST_HREFS[activeTab]}`} className="px-4">
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
                        <ToggleGroupItem value={ContentTypeEnum.ANIME} aria-label="Аніме">
                            Аніме
                        </ToggleGroupItem>
                        <ToggleGroupItem value={ContentTypeEnum.MANGA} aria-label="Манґа">
                            Манґа
                        </ToggleGroupItem>
                        <ToggleGroupItem value={ContentTypeEnum.NOVEL} aria-label="Ранобе">
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

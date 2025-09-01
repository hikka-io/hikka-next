'use client';

import { useFollowingHistory, useSession } from '@hikka/react';
import { FC } from 'react';

import HistoryItem from '@/components/history-item';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const { list } = useFollowingHistory();

    const filteredHistory = list?.slice(0, 3);

    return (
        <Card>
            <Block className={cn(className)}>
                <Header href={`/u/${user?.username}/history?type=following`}>
                    <HeaderContainer>
                        <HeaderTitle>Активність</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>
                <div className="flex flex-col gap-6">
                    {filteredHistory?.map((item) => (
                        <HistoryItem
                            data={item}
                            key={item.reference}
                            withUser
                        />
                    ))}
                    {filteredHistory?.length === 0 && (
                        <NotFound
                            title="Історія відсутня"
                            description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                        />
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default History;

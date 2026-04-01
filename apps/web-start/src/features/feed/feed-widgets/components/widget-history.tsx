'use client';

import { useFollowingHistory, useSession } from '@hikka/react';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import HistoryItem from '@/features/users/user-history/components/history-item';

const HISTORY_SIZE = 3;

const WidgetHistory = () => {
    const { user } = useSession();
    const { list } = useFollowingHistory();

    const filteredHistory = list?.slice(0, HISTORY_SIZE);

    if (!user) return null;

    return (
        <Card className="bg-secondary/20 p-0 backdrop-blur-xl" id="history">
            <Block className="w-full gap-4 py-4">
                <Header
                    href={`/u/${user.username}/history`}
                    search={{ type: 'following' }}
                    className="px-4"
                >
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Активність</HeaderTitle>
                    </HeaderContainer>
                    <HeaderNavButton />
                </Header>

                <div className="flex flex-col gap-6 px-4">
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

export default WidgetHistory;

import { type FC, useMemo } from 'react';

import { followingHistoryInfiniteOptions } from '@hikka/api';

import { HistoryItem } from '@/components/content-card';
import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import { useSession } from '@/features/auth/hooks/use-session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import type { WidgetProps } from '../constants';

const HISTORY_SIZE = 3;
const HISTORY_REFETCH_INTERVAL_MS = 30_000;

const HistoryWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const { list } = useInfiniteList(
        {
            ...followingHistoryInfiniteOptions(),
            refetchInterval: HISTORY_REFETCH_INTERVAL_MS,
        },
        { enabled: Boolean(user) },
    );

    const filteredHistory = useMemo(() => list?.slice(0, HISTORY_SIZE), [list]);

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
                        <EmptyState
                            icon={<MaterialSymbolsHistoryRounded />}
                            title="Історія відсутня"
                            description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                        />
                    )}
                </div>
            </Block>
        </Card>
    );
};

export default HistoryWidget;

import type { FC } from 'react';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import { HistoryTimeline } from '@/components/list-items';
import Block from '@/components/ui/block';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { useVisible } from '@/services/hooks/use-visible';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

import { homeFollowingHistoryOptions } from '../queries';
import type { WidgetProps } from '../types';

const HISTORY_REFETCH_INTERVAL_MS = 60_000;

const HistoryWidget: FC<WidgetProps> = () => {
    const { user } = useSession();
    const { ref, visible } = useVisible();
    const { list } = useInfiniteList(
        {
            ...homeFollowingHistoryOptions(),
            refetchInterval: HISTORY_REFETCH_INTERVAL_MS,
        },
        { enabled: visible && Boolean(user) },
    );

    if (!user) return null;

    return (
        <Block variant="card" ref={ref} id="history">
            <Header>
                <HeaderTitle
                    to={`/u/${user.username}/history`}
                    search={{ type: 'following' }}
                >
                    Активність
                </HeaderTitle>
            </Header>

            {list && list.length > 0 && (
                <HistoryTimeline items={list} withUser />
            )}
            {list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsHistoryRounded />}
                    title="Історія відсутня"
                    description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                />
            )}
        </Block>
    );
};

export default HistoryWidget;

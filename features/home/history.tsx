'use client';

import { FC } from 'react';

import HistoryItem from '@/components/history-item';
import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import useSession from '@/services/hooks/auth/useSession';
import useUserHistory from '@/services/hooks/history/useFollowingHistory';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const { list } = useUserHistory();

    const filteredHistory = list?.slice(0, 3);

    return (
        <Block className={cn(className)}>
            <Header
                title="Історія"
                href={`/u/${user?.username}/history?type=following`}
            />
            <div className="flex flex-col gap-6">
                {filteredHistory?.map((item) => (
                    <HistoryItem data={item} key={item.reference} withUser />
                ))}
                {filteredHistory?.length === 0 && (
                    <NotFound
                        title="Історія відсутня"
                        description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                    />
                )}
            </div>
        </Block>
    );
};

export default History;

'use client';

import { FC } from 'react';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import useUserHistory from '@/services/hooks/history/useFollowingHistory';
import { cn } from '@/utils/utils';

import HistoryItem from './components/ui/history-item';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
    const { list } = useUserHistory();

    const filteredHistory = list?.slice(0, 3);

    return (
        <Block className={cn(className)}>
            <Header title="Активність" />
            <div className="flex flex-col gap-6">
                {filteredHistory?.map((item) => (
                    <HistoryItem data={item} key={item.reference} />
                ))}
            </div>
        </Block>
    );
};

export default History;

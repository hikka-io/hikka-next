'use client';

import { FC } from 'react';

import { useParams } from 'next/navigation';

import Block from '@/components/ui/block';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import useUserHistory from '@/services/hooks/user/useUserHistory';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import ActivityModal from './components/history-modal';
import ActivityItem from './components/ui/history-item';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
    const params = useParams();
    const { openModal } = useModalContext();

    const { list: activity } = useUserHistory({
        username: String(params.username),
    });

    const filteredActivity = activity?.slice(0, 3);

    const handleOpenModal = () => {
        openModal({
            type: 'sheet',
            title: 'Активність',
            side: 'right',
            content: <ActivityModal />,
        });
    };

    return (
        <Block className={cn(className)}>
            <Header
                title={'Історія'}
                onClick={
                    activity && activity?.length > 0
                        ? handleOpenModal
                        : undefined
                }
            />
            <div className="flex flex-col gap-6">
                {filteredActivity &&
                    filteredActivity.map((item) => (
                        <ActivityItem data={item} key={item.reference} />
                    ))}
                {activity && activity?.length === 0 && (
                    <NotFound
                        title={'Історія відсутня'}
                        description="Інформація оновиться після змін у списку"
                    />
                )}
            </div>
        </Block>
    );
};

export default History;

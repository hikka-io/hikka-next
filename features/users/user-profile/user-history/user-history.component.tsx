'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';

import HistoryItem from '@/components/history-item';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';

import useUserHistory from '@/services/hooks/user/useUserHistory';
import { useModalContext } from '@/services/providers/modal-provider';
import { cn } from '@/utils/utils';

import ActivityModal from './history-modal';

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
                title="Історія"
                onClick={
                    activity && activity?.length > 0
                        ? handleOpenModal
                        : undefined
                }
            >
                <Button asChild size="icon-sm" variant="outline">
                    <Link href={`/u/${params.username}/history`}>
                        <MaterialSymbolsGridViewRounded />
                    </Link>
                </Button>
            </Header>
            <div className="flex flex-col gap-6">
                {filteredActivity &&
                    filteredActivity.map((item) => (
                        <HistoryItem data={item} key={item.reference} />
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

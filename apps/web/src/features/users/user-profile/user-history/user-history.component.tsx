'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import HistoryItem from '@/components/history-item';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import NotFound from '@/components/ui/not-found';
import useUserHistory from '@/services/hooks/history/use-user-history';
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
                onClick={
                    activity && activity?.length > 0
                        ? handleOpenModal
                        : undefined
                }
            >
                <HeaderContainer>
                    <HeaderTitle>Історія</HeaderTitle>
                    <Button asChild size="icon-sm" variant="outline">
                        <Link href={`/u/${params.username}/history`}>
                            <MaterialSymbolsGridViewRounded />
                        </Link>
                    </Button>
                </HeaderContainer>
                <HeaderNavButton />
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

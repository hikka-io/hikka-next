'use client';

import { useFollowingHistory, useSession } from '@hikka/react';
import Link from 'next/link';
import { FC } from 'react';

import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import NotFound from '@/components/ui/not-found';

import { cn } from '@/utils/utils';

import HistoryItem from '../../components/history-item';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const { list } = useFollowingHistory();

    const filteredHistory = list?.slice(0, 3);

    return (
        <Block className={cn(className)}>
            <Card className="flex flex-col gap-6">
                {filteredHistory?.map((item) => (
                    <HistoryItem data={item} key={item.reference} withUser />
                ))}
                {filteredHistory?.length === 0 && (
                    <NotFound
                        title="Історія відсутня"
                        description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                    />
                )}
                <Button asChild size="md" variant="outline">
                    <Link href={`/u/${user?.username}/history?type=following`}>
                        Переглянути всі
                    </Link>
                </Button>
            </Card>
        </Block>
    );
};

export default History;

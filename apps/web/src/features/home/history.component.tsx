'use client';

import Link from 'next/link';
import { FC } from 'react';

import HistoryItem from '../../components/history-item';
import Block from '../../components/ui/block';
import { Button } from '../../components/ui/button';
import Card from '../../components/ui/card';
import NotFound from '../../components/ui/not-found';
import useSession from '../../services/hooks/auth/use-session';
import useUserHistory from '../../services/hooks/history/use-following-history';
import { cn } from '../../utils/utils';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
    const { user } = useSession();
    const { list } = useUserHistory();

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

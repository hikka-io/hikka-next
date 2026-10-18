import type { FC } from 'react';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import { HistoryTimeline } from '@/components/list-items';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

import { userHistoryPreviewOptions } from '../queries';

type Props = {
    className?: string;
};

const UserHistory: FC<Props> = ({ className }) => {
    const params = useParams();

    const { list: activity } = useInfiniteList(
        userHistoryPreviewOptions(String(params.username)),
    );

    const filteredActivity = activity?.slice(0, 3);

    return (
        <Card className={cn(className)} id="user-history">
            <Block>
                <Header>
                    <HeaderTitle to={`/u/${params.username}/history`}>
                        Історія
                    </HeaderTitle>
                </Header>
                {filteredActivity && filteredActivity.length > 0 && (
                    <HistoryTimeline items={filteredActivity} />
                )}
                {activity && activity?.length === 0 && (
                    <EmptyState
                        icon={<MaterialSymbolsHistoryRounded />}
                        title="Історія відсутня"
                        description="Інформація оновиться після змін у списку"
                    />
                )}
            </Block>
        </Card>
    );
};

export default UserHistory;

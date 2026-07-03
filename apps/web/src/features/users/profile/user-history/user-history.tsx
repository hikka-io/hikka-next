import { type FC, useState } from 'react';

import { userHistoryInfiniteOptions } from '@hikka/api';

import { HistoryItem } from '@/components/content-card';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import Block from '@/components/ui/block';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import {
    Header,
    HeaderContainer,
    HeaderNavButton,
    HeaderTitle,
} from '@/components/ui/header';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useCloseOnRouteChange } from '@/services/hooks/use-close-on-route-change';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { Link, useParams } from '@/utils/navigation';

import ActivityModal from './components/history-modal';

type Props = {
    className?: string;
};

const History: FC<Props> = ({ className }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { list: activity } = useInfiniteList(
        userHistoryInfiniteOptions({
            path: { username: String(params.username) },
        }),
    );

    const filteredActivity = activity?.slice(0, 3);

    return (
        <>
            <Card className={cn(className)} id="user-history">
                <Block>
                    <Header
                        onClick={
                            activity && activity?.length > 0
                                ? () => setOpen(true)
                                : undefined
                        }
                    >
                        <HeaderContainer>
                            <HeaderTitle variant="h4">Історія</HeaderTitle>
                            <Button asChild size="icon-sm" variant="outline">
                                <Link to={`/u/${params.username}/history`}>
                                    <MaterialSymbolsGridViewRounded />
                                </Link>
                            </Button>
                        </HeaderContainer>
                        <HeaderNavButton />
                    </Header>
                    <div className="flex flex-col gap-6">
                        {filteredActivity?.map((item) => (
                            <HistoryItem data={item} key={item.reference} />
                        ))}
                        {activity && activity?.length === 0 && (
                            <EmptyState
                                icon={<MaterialSymbolsHistoryRounded />}
                                title="Історія відсутня"
                                description="Інформація оновиться після змін у списку"
                            />
                        )}
                    </div>
                </Block>
            </Card>
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Активність">
                    <ActivityModal />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default History;

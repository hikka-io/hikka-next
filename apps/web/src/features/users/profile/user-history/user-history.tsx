import { type FC, useState } from 'react';

import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import { HistoryTimeline } from '@/components/list-items';
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

import { userHistoryPreviewOptions } from '../../queries';
import HistoryModal from './history-modal';

type Props = {
    className?: string;
};

const UserHistory: FC<Props> = ({ className }) => {
    const params = useParams();
    const [open, setOpen] = useState(false);
    useCloseOnRouteChange(setOpen);

    const { list: activity } = useInfiniteList(
        userHistoryPreviewOptions(String(params.username)),
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
                            <Button
                                size="icon-sm"
                                variant="outline"
                                render={
                                    <Link
                                        to={`/u/${params.username}/history`}
                                    />
                                }
                            >
                                <MaterialSymbolsGridViewRounded />
                            </Button>
                        </HeaderContainer>
                        <HeaderNavButton />
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
            <ResponsiveModal open={open} onOpenChange={setOpen} type="sheet">
                <ResponsiveModalContent side="right" title="Історія">
                    <HistoryModal />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
};

export default UserHistory;

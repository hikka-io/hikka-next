import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchIgnoredNotifications } from '@hikka/react/server';
import { FC } from 'react';

import P from '@/components/typography/p';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Notifications from '@/features/settings/notifications/notifications.component';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        slug: string;
    };
}

const NotificationsSettingsPage: FC<Props> = async (props) => {
    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchIgnoredNotifications({
        clientConfig,
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col">
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle>Сповіщення</HeaderTitle>
                        </HeaderContainer>
                    </Header>
                    <P className="text-sm text-muted-foreground">
                        Налаштуйте персоналізовані сповіщення
                    </P>
                </div>
                <Notifications />
            </div>
        </HydrationBoundary>
    );
};

export default NotificationsSettingsPage;

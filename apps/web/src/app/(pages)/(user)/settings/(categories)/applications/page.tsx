import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchClientList } from '@hikka/react/server';
import { FC } from 'react';

import P from '@/components/typography/p';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import Applications from '@/features/settings/applications/applications.component';
import ClientCreateButton from '@/features/settings/applications/client-create-button.component';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        slug: string;
    };
}

const ApplicationsSettingsPage: FC<Props> = async (props) => {
    const params = await props.params;
    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchClientList({
        queryClient,
        clientConfig,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col">
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle>Застосунки</HeaderTitle>
                            <ClientCreateButton />
                        </HeaderContainer>
                    </Header>

                    <P className="text-muted-foreground text-sm">
                        Підключіть OAuth авторизацію через hikka за допомогою
                        застосунку (для розробників)
                    </P>
                </div>
                <Applications />
            </div>
        </HydrationBoundary>
    );
};

export default ApplicationsSettingsPage;

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { FC } from 'react';

import P from '@/components/typography/p';
import {
    Header,
    HeaderContainer,
    HeaderTitle,
} from '@/components/ui/header';
import Applications from '@/features/settings/applications/applications.component';
import ClientCreateButton from '@/features/settings/applications/client-create-button.component';
import { prefetchClients } from '@/services/hooks/client/use-clients';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    params: {
        slug: string;
    };
}

const ApplicationsSettingsPage: FC<Props> = async (props) => {
    const params = await props.params;
    const queryClient = getQueryClient();

    await prefetchClients();

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

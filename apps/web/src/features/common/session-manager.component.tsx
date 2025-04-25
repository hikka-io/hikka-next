import { UserResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    prefetchSession,
} from '@hikka/react';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props extends PropsWithChildren {}

const SessionManager = async ({ children }: Props) => {
    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    let loggedUser: UserResponse | undefined;

    clientConfig.authToken &&
        (loggedUser = await prefetchSession({ clientConfig }));

    if (clientConfig.authToken && !loggedUser) {
        redirect(`${process.env.SITE_URL}/auth/logout`);
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    );
};

export default SessionManager;

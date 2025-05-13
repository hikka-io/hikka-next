import { UserResponse } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchSession } from '@hikka/react/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props extends PropsWithChildren {}

const SessionManager = async ({ children }: Props) => {
    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    let loggedUser: UserResponse | undefined;

    clientConfig.authToken &&
        (loggedUser = await prefetchSession({ clientConfig, queryClient }));

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

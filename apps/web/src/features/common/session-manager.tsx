import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
    queryKeys,
} from '@hikka/react/core';
import { prefetchSession } from '@hikka/react/server';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { getHikkaClientConfig } from '@/utils/hikka-client';

interface Props extends PropsWithChildren {}

const SessionManager = async ({ children }: Props) => {
    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    clientConfig.authToken &&
        (await prefetchSession({ clientConfig, queryClient }));

    const state = queryClient.getQueryState(queryKeys.user.me());

    if (
        state?.error &&
        typeof state.error === 'object' &&
        'code' in state.error &&
        state.error.code === 'auth:invalid_token'
    ) {
        return redirect(`${process.env.SITE_URL}/auth/logout`);
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    );
};

export default SessionManager;

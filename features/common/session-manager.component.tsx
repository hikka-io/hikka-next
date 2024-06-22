import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import { getCookie } from '@/utils/cookies';
import getQueryClient from '@/utils/get-query-client';

interface Props extends PropsWithChildren {}

const SessionManager = async ({ children }: Props) => {
    const queryClient = await getQueryClient();
    const auth = await getCookie('auth');

    try {
        auth &&
            (await queryClient.fetchQuery({
                queryKey: ['logged-user'],
                queryFn: ({ meta }) => getLoggedUserInfo({}),
            }));
    } catch (e) {
        // console.log(e);
        // await deleteCookie('auth');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    );
};

export default SessionManager;

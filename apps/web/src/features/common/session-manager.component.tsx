import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import getLoggedUserInfo from '../../services/api/user/getLoggedUserInfo';
import { getCookie } from '../../utils/cookies';
import getQueryClient from '../../utils/get-query-client';

interface Props extends PropsWithChildren {}

const SessionManager = async ({ children }: Props) => {
    const queryClient = await getQueryClient();
    const auth = await getCookie('auth');

    auth &&
        (await queryClient.prefetchQuery({
            queryKey: ['logged-user'],
            queryFn: ({ meta }) => getLoggedUserInfo({}),
        }));

    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'logged-user',
    ]);

    if (auth && !loggedUser) {
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

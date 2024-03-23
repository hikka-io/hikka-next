import { PropsWithChildren } from 'react';

import { headers } from 'next/headers';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import getQueryClient from '@/utils/getQueryClient';

interface Props extends PropsWithChildren {}

const Component = async ({ children }: Props) => {
    const headersList = headers();
    const queryClient = getQueryClient();

    try {
        const auth = await queryClient.fetchQuery({
            queryKey: ['auth'],
            queryFn: async () => await getCookie('auth'),
        });

        await queryClient.fetchQuery({
            queryKey: ['loggedUser', auth],
            queryFn: () => getLoggedUserInfo({ auth: auth }),
        });
    } catch (e) {
        await fetch('http://' + headersList.get('host') + '/auth/logout');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    );
};

export default Component;

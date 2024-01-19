import { PropsWithChildren } from 'react';

import { headers } from 'next/headers';

import { dehydrate } from '@tanstack/query-core';

import { getCookie } from '@/app/actions';
import RQHydrate from '@/utils/RQ-hydrate';
import getLoggedUserInfo from '@/utils/api/user/getLoggedUserInfo';
import getQueryClient from '@/utils/getQueryClient';

interface Props extends PropsWithChildren {}

const Component = async ({ children }: Props) => {
    const headersList = headers();
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery(['loggedUser'], () =>
        getLoggedUserInfo({ secret: secret }),
        {
            cacheTime: Infinity,
            staleTime: Infinity
        }
    );

    const dehydratedState = dehydrate(queryClient);

    const loggedUserData: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    if (!loggedUserData) {
        await fetch('http://' + headersList.get('host') + '/auth/logout');
    }

    return <RQHydrate state={dehydratedState}>{children}</RQHydrate>;
};

export default Component;

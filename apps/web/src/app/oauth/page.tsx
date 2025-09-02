import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchClientByReference } from '@hikka/react/server';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import { SessionManager } from "@/features/common";
import {
    OAuthClient as Client,
    OAuthConfirm as Confirm,
    OAuthHeader as Header,
    OAuthProfile as Profile,
} from '@/features/oauth';

interface Props {
    searchParams: {
        reference: string;
        scope: string;
    };
}

const OAuthPage: FC<Props> = async (props) => {
    const searchParams = await props.searchParams;
    if (!searchParams.reference || !searchParams.scope) {
        return permanentRedirect('/');
    }

    const queryClient = getQueryClient();

    await prefetchClientByReference({
        reference: searchParams.reference,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <SessionManager>
                <main className="container mx-auto my-8 min-h-screen max-w-xl px-4 lg:my-16">
                    <div className="flex h-full flex-col items-center justify-start gap-8">
                        <Header />
                        <Profile />
                        <Client />
                        <Confirm />
                    </div>
                </main>
            </SessionManager>
        </HydrationBoundary>
    );
};

export default OAuthPage;

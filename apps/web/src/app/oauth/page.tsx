import { prefetchClientByReference } from '@hikka/react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { permanentRedirect } from 'next/navigation';
import { FC, Suspense } from 'react';

import ModalManager from '@/features/common/modal-manager.component';
import SessionManager from '@/features/common/session-manager.component';
import Client from '@/features/oauth/client/client.component';
import Confirm from '@/features/oauth/confirm.component';
import Header from '@/features/oauth/oauth-header';
import Profile from '@/features/oauth/profile/profile.component';

import getQueryClient from '@/utils/get-query-client';

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
                <Suspense>
                    <ModalManager />
                </Suspense>

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

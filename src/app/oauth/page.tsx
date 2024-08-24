import { ReactNode, Suspense } from 'react';

import ModalManager from '@/features/common/modal-manager.component';
import SessionManager from '@/features/common/session-manager.component';
import Client from '@/features/oauth/client/client.component';
import Confirm from '@/features/oauth/confirm.component';
import Header from '@/features/oauth/header';
import Profile from '@/features/oauth/profile/profile.component';

interface Props {
    children: ReactNode;
}

const OAuthPage = () => {
    return (
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
    );
};

export default OAuthPage;

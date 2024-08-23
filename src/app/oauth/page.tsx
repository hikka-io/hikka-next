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

            <main className="container mx-auto min-h-screen px-4 my-8 lg:my-16 max-w-xl">
                <div className="flex flex-col gap-8 h-full justify-start items-center">
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

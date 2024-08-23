import { FC } from 'react';

import Header from '@/components/ui/header';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import { Button } from '@/components/ui/button';

import useSession from '@/services/hooks/auth/use-session';
import Applications from '@/features/settings/applications/applications';
import ClientCreateButton from '@/features/settings/applications/client-create-button';

interface Props {
    params: {
        slug: string;
    };
}

const ApplicationsSettingsPage: FC<Props> = async ({ params }) => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header title="Сторонні додатки">
                    <ClientCreateButton />
                </Header>
            </div>
            <Applications />
        </div>
    );
};

export default ApplicationsSettingsPage;
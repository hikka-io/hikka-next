import { FC } from 'react';

import P from '@/components/typography/p';
import Header from '@/components/ui/header';

import Notifications from '@/features/settings/notifications/notifications';

interface Props {
    params: {
        slug: string;
    };
}

const NotificationsSettingsPage: FC<Props> = async ({ params }) => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header title="Сповіщення" />
                <P className="text-sm text-muted-foreground">
                    Налаштуйте персоналізовані сповіщення
                </P>
            </div>
            <Notifications />
        </div>
    );
};

export default NotificationsSettingsPage;

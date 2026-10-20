import type { FC } from 'react';

import { Bell } from 'lucide-react-native';

import { SignInPrompt, useAuthToken } from '@/features/auth';

import NotificationsList from './notifications-list';

const NotificationsScreen: FC = () => {
    const token = useAuthToken();

    if (!token) {
        return (
            <SignInPrompt
                icon={Bell}
                description="Увійдіть, щоб бачити відповіді, згадки та нові епізоди"
            />
        );
    }

    return <NotificationsList />;
};

export default NotificationsScreen;

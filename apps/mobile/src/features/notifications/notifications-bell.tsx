import type { FC } from 'react';

import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { useAuthToken } from '@/features/auth';

import { badgeText } from './notification-url';
import { useUnseenNotifications } from './use-unseen-notifications';

const BELL_ICON = require('../../../assets/icons/notifications.xml');

const NotificationsBell: FC = () => {
    const router = useRouter();
    const token = useAuthToken();
    const unseen = useUnseenNotifications();

    if (!token) return null;

    return (
        <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
                icon={Platform.OS === 'android' ? BELL_ICON : 'bell'}
                accessibilityLabel={
                    unseen > 0 && Platform.OS === 'ios'
                        ? `Сповіщення, непрочитаних: ${unseen}`
                        : 'Сповіщення'
                }
                onPress={() => router.push('/notifications')}
            >
                {unseen > 0 ? (
                    <Stack.Toolbar.Badge>
                        {badgeText(unseen)}
                    </Stack.Toolbar.Badge>
                ) : null}
            </Stack.Toolbar.Button>
        </Stack.Toolbar>
    );
};

export default NotificationsBell;

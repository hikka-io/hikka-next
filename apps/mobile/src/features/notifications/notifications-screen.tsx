import type { FC } from 'react';

import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { useAuthToken } from '@/features/auth';

import NotificationsList from './notifications-list';

const NotificationsScreen: FC = () => {
    const router = useRouter();
    const token = useAuthToken();

    if (!token) {
        return (
            <EmptyState
                className="bg-background"
                icon={<Icon as={Bell} />}
                title="Сповіщення"
                description="Увійдіть, щоб бачити відповіді, згадки та нові епізоди"
                action={
                    <Button onPress={() => router.push('/login')}>
                        Увійти
                    </Button>
                }
            />
        );
    }

    return <NotificationsList />;
};

export default NotificationsScreen;

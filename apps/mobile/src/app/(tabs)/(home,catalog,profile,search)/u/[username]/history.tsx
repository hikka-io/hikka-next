import { useLocalSearchParams } from 'expo-router';

import { HistoryPage } from '@/features/users';

export default function UserHistoryScreen() {
    const { username, type } = useLocalSearchParams<{
        username: string;
        type?: string;
    }>();

    return (
        <HistoryPage
            key={username}
            username={username}
            initialSource={type === 'following' ? 'following' : 'user'}
        />
    );
}

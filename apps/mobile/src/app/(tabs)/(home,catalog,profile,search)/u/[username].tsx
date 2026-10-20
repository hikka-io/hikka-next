import { useLocalSearchParams } from 'expo-router';

import { UserPage } from '@/features/users';

export default function UserScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();

    return <UserPage key={username} username={username} />;
}

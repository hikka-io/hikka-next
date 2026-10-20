import { useLocalSearchParams } from 'expo-router';

import { FollowList } from '@/features/users';

export default function UserFollowersScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();

    return <FollowList key={username} kind="followers" username={username} />;
}

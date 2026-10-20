import { useLocalSearchParams } from 'expo-router';

import { FollowList } from '@/features/users';

export default function UserFollowingScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();

    return <FollowList key={username} kind="followings" username={username} />;
}

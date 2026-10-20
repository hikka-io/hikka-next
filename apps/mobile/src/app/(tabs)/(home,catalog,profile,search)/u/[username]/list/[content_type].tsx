import { Redirect, useLocalSearchParams } from 'expo-router';

import { MainContentTypeEnum } from '@hikka/api';

import { UserListPage } from '@/features/users';

const CONTENT_TYPES: readonly string[] = Object.values(MainContentTypeEnum);

const isContentType = (value: string): value is MainContentTypeEnum =>
    CONTENT_TYPES.includes(value);

export default function UserListScreen() {
    const { username, content_type, status } = useLocalSearchParams<{
        username: string;
        content_type: string;
        status?: string;
    }>();

    if (!isContentType(content_type)) {
        return <Redirect href={`/u/${username}`} />;
    }

    return (
        <UserListPage
            key={`${username}/${content_type}`}
            username={username}
            contentType={content_type}
            initialStatus={status}
        />
    );
}

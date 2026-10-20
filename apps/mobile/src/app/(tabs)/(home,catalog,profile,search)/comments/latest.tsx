import { Stack } from 'expo-router';

import { LatestComments } from '@/features/comments';

export default function LatestCommentsScreen() {
    return (
        <>
            <Stack.Title>Останні коментарі</Stack.Title>
            <LatestComments />
        </>
    );
}

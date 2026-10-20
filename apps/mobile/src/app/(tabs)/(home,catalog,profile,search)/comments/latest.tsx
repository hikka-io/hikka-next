import { Stack } from 'expo-router';

import EmptyState from '@/components/ui/empty-state';

export default function LatestCommentsScreen() {
    return (
        <>
            <Stack.Title>Останні коментарі</Stack.Title>
            <EmptyState title="Незабаром" className="flex-1 justify-center" />
        </>
    );
}

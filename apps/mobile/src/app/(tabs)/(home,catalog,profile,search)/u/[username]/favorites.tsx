import { Stack } from 'expo-router';

import EmptyState from '@/components/ui/empty-state';

export default function UserFavoritesScreen() {
    return (
        <>
            <Stack.Title>Улюблене</Stack.Title>
            <EmptyState title="Незабаром" className="flex-1 justify-center" />
        </>
    );
}

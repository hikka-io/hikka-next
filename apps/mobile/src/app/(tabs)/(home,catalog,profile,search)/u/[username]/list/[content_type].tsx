import { Stack } from 'expo-router';

import EmptyState from '@/components/ui/empty-state';

export default function UserListScreen() {
    return (
        <>
            <Stack.Title>Список</Stack.Title>
            <EmptyState title="Незабаром" className="flex-1 justify-center" />
        </>
    );
}

import { Stack } from 'expo-router';

import EmptyState from '@/components/ui/empty-state';

export default function CollectionsScreen() {
    return (
        <>
            <Stack.Title>Колекції</Stack.Title>
            <EmptyState title="Незабаром" className="flex-1 justify-center" />
        </>
    );
}

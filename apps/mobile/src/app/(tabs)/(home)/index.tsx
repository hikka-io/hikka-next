import { Stack } from 'expo-router';

import EmptyState from '@/components/ui/empty-state';

export default function HomeScreen() {
    return (
        <>
            <Stack.Title large>Головна</Stack.Title>
            <EmptyState title="Незабаром" className="flex-1 justify-center" />
        </>
    );
}

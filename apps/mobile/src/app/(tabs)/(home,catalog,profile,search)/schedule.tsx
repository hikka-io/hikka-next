import { Stack } from 'expo-router';

import EmptyState from '@/components/ui/empty-state';

export default function ScheduleScreen() {
    return (
        <>
            <Stack.Title>Календар</Stack.Title>
            <EmptyState title="Незабаром" className="flex-1 justify-center" />
        </>
    );
}

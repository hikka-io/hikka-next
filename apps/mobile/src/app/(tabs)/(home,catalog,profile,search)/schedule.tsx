import { Stack } from 'expo-router';

import { ScheduleScreen } from '@/features/schedule';

export default function ScheduleRoute() {
    return (
        <>
            <Stack.Title>Календар</Stack.Title>
            <ScheduleScreen />
        </>
    );
}

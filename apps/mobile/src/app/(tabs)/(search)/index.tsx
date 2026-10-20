import { Stack } from 'expo-router';

import { SearchScreen } from '@/features/search';

export default function SearchTab() {
    return (
        <>
            <Stack.Title large>Пошук</Stack.Title>
            <SearchScreen />
        </>
    );
}

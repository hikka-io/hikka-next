import { Stack } from 'expo-router';

import { CollectionList } from '@/features/collections';

export default function CollectionsScreen() {
    return (
        <>
            <Stack.Title>Колекції</Stack.Title>
            <CollectionList />
        </>
    );
}

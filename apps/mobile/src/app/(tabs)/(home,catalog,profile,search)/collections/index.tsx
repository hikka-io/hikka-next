import { Stack, useLocalSearchParams } from 'expo-router';

import { CollectionList } from '@/features/collections';

export default function CollectionsScreen() {
    const { author } = useLocalSearchParams<{ author?: string }>();

    return (
        <>
            <Stack.Title>Колекції</Stack.Title>
            <CollectionList key={author} author={author || undefined} />
        </>
    );
}

import { useLocalSearchParams } from 'expo-router';

import { CollectionPage } from '@/features/collections';

export default function CollectionScreen() {
    const { reference } = useLocalSearchParams<{ reference: string }>();

    return <CollectionPage key={reference} reference={reference} />;
}

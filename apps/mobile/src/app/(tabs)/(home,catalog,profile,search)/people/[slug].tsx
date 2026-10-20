import { useLocalSearchParams } from 'expo-router';

import { PersonPage } from '@/features/entities';

export default function PersonScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    return <PersonPage key={slug} slug={slug} />;
}

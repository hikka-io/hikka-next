import { useLocalSearchParams } from 'expo-router';

import { CharacterPage } from '@/features/entities';

export default function CharacterScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    return <CharacterPage key={slug} slug={slug} />;
}

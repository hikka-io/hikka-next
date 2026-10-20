import { useLocalSearchParams } from 'expo-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';

export default function AnimeDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    return (
        <ContentDetailPage contentType={ContentTypeEnum.ANIME} slug={slug} />
    );
}

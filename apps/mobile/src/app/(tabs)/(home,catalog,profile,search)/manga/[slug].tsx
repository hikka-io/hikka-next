import { useLocalSearchParams } from 'expo-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';

export default function MangaDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    return (
        <ContentDetailPage contentType={ContentTypeEnum.MANGA} slug={slug} />
    );
}

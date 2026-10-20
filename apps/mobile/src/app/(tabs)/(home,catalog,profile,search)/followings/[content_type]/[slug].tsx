import { Stack, useLocalSearchParams } from 'expo-router';

import { MainContentTypeEnum } from '@hikka/api';

import EmptyState from '@/components/ui/empty-state';
import { ContentFollowingList } from '@/features/content';

const CONTENT_TYPES: readonly string[] = Object.values(MainContentTypeEnum);

const isContentType = (value: string): value is MainContentTypeEnum =>
    CONTENT_TYPES.includes(value);

export default function ContentFollowingsScreen() {
    const { content_type, slug } = useLocalSearchParams<{
        content_type: string;
        slug: string;
    }>();

    if (!isContentType(content_type) || !slug) {
        return (
            <>
                <Stack.Title>Відстежується</Stack.Title>
                <EmptyState
                    title="Сторінку не знайдено"
                    description="Вона не існує або була переміщена"
                    className="flex-1 justify-center bg-background"
                />
            </>
        );
    }

    return (
        <ContentFollowingList
            key={`${content_type}/${slug}`}
            contentType={content_type}
            slug={slug}
        />
    );
}

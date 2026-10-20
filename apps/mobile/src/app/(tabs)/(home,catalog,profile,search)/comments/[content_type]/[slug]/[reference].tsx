import { Stack, useLocalSearchParams } from 'expo-router';

import EmptyState from '@/components/ui/empty-state';
import { CommentsList, isCommentContentType } from '@/features/comments';

export default function CommentThreadScreen() {
    const { content_type, slug, reference } = useLocalSearchParams<{
        content_type: string;
        slug: string;
        reference: string;
    }>();

    return (
        <>
            <Stack.Title>Гілка</Stack.Title>
            {isCommentContentType(content_type) && slug && reference ? (
                <CommentsList
                    key={reference}
                    contentType={content_type}
                    slug={slug}
                    reference={reference}
                />
            ) : (
                <EmptyState
                    title="Сторінку не знайдено"
                    description="Вона не існує або була переміщена"
                    className="flex-1 justify-center bg-background"
                />
            )}
        </>
    );
}

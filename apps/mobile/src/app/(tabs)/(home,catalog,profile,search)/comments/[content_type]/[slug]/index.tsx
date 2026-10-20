import { Stack, useLocalSearchParams } from 'expo-router';

import { ContentTypeEnum } from '@hikka/api';

import EmptyState from '@/components/ui/empty-state';
import {
    CommentsList,
    isCommentContentType,
    UserComments,
} from '@/features/comments';

export default function CommentsScreen() {
    const { content_type, slug } = useLocalSearchParams<{
        content_type: string;
        slug: string;
    }>();

    if (content_type === ContentTypeEnum.USER) {
        return (
            <>
                <Stack.Title>Коментарі</Stack.Title>
                <UserComments key={slug} username={slug} />
            </>
        );
    }

    if (!isCommentContentType(content_type) || !slug) {
        return (
            <>
                <Stack.Title>Коментарі</Stack.Title>
                <EmptyState
                    title="Сторінку не знайдено"
                    description="Вона не існує або була переміщена"
                    className="flex-1 justify-center bg-background"
                />
            </>
        );
    }

    return (
        <>
            <Stack.Title>Обговорення</Stack.Title>
            <CommentsList
                key={`${content_type}/${slug}`}
                contentType={content_type}
                slug={slug}
            />
        </>
    );
}

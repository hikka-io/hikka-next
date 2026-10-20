import { Stack, useLocalSearchParams } from 'expo-router';

import { CommentTypeEnum, ContentTypeEnum } from '@hikka/api';

import EmptyState from '@/components/ui/empty-state';
import {
    CommentsList,
    isCommentContentType,
    UserComments,
} from '@/features/comments';

const COMMENT_TYPES: readonly string[] = Object.values(CommentTypeEnum);

const isCommentType = (value?: string): value is CommentTypeEnum =>
    !!value && COMMENT_TYPES.includes(value);

export default function CommentsScreen() {
    const { content_type, slug, comment_type } = useLocalSearchParams<{
        content_type: string;
        slug: string;
        comment_type?: string;
    }>();

    if (content_type === ContentTypeEnum.USER) {
        return (
            <>
                <Stack.Title>Коментарі</Stack.Title>
                <UserComments
                    key={`${slug}/${comment_type}`}
                    username={slug}
                    initialType={
                        isCommentType(comment_type) ? comment_type : undefined
                    }
                />
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

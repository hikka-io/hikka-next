import { Redirect, useLocalSearchParams } from 'expo-router';

import { CommentComposer, isCommentContentType } from '@/features/comments';

export default function CommentComposerScreen() {
    const { content_type, slug, reply, edit, review } = useLocalSearchParams<{
        content_type: string;
        slug: string;
        reply?: string;
        edit?: string;
        review?: string;
    }>();

    if (!isCommentContentType(content_type) || !slug) {
        return <Redirect href="/" />;
    }

    return (
        <CommentComposer
            key={`${content_type}/${slug}/${reply ?? ''}/${edit ?? ''}`}
            contentType={content_type}
            slug={slug}
            reply={reply}
            edit={edit}
            review={review === '1'}
        />
    );
}

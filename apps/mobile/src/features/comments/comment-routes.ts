import type { Href } from 'expo-router';

import { CommentContentTypeEnum } from '@hikka/api';

type Target = {
    contentType: CommentContentTypeEnum;
    slug: string;
    reply?: string;
    edit?: string;
    /** Opens the root composer as a review (the list shows reviews). */
    review?: boolean;
};

/** The composer sheet (`src/app/comment/[content_type]/[slug].tsx`), a root-stack form sheet. */
export const composerHref = ({
    contentType,
    slug,
    reply,
    edit,
    review,
}: Target): Href => ({
    pathname: '/comment/[content_type]/[slug]',
    params: {
        content_type: contentType,
        slug,
        ...(reply && { reply }),
        ...(edit && { edit }),
        ...(review && { review: '1' }),
    },
});

export const threadHref = (
    contentType: string,
    slug: string,
    reference?: string,
): Href =>
    (reference
        ? `/comments/${contentType}/${slug}/${reference}`
        : `/comments/${contentType}/${slug}`) as Href;

const COMMENT_CONTENT_TYPES: readonly string[] = Object.values(
    CommentContentTypeEnum,
);

export const isCommentContentType = (
    value: string,
): value is CommentContentTypeEnum => COMMENT_CONTENT_TYPES.includes(value);

import type { FC } from 'react';

import { CommentContentTypeEnum } from '@hikka/api';

import { CommentsPreview } from '@/features/comments';

type Props = {
    slug: string;
    commentsCount: number;
};

/** The web's `CommentList preview` under an article; the list item mounts near the viewport, so it loads then. */
const ArticleCommentsSlot: FC<Props> = ({ slug, commentsCount }) => (
    <CommentsPreview
        contentType={CommentContentTypeEnum.ARTICLE}
        slug={slug}
        commentsCount={commentsCount}
        enabled
    />
);

export default ArticleCommentsSlot;

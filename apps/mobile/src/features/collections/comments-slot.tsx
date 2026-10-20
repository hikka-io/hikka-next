import type { FC } from 'react';

import { CommentContentTypeEnum } from '@hikka/api';

import { CommentsPreview } from '@/features/comments';

type Props = {
    reference: string;
    commentsCount: number;
};

/** The web's `CommentList preview` under a collection; the list item mounts near the viewport, so it loads then. */
const CollectionCommentsSlot: FC<Props> = ({ reference, commentsCount }) => (
    <CommentsPreview
        contentType={CommentContentTypeEnum.COLLECTION}
        slug={reference}
        commentsCount={commentsCount}
        enabled
    />
);

export default CollectionCommentsSlot;

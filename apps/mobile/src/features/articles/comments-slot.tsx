import type { FC } from 'react';

type Props = {
    slug: string;
};

// The comments task renders the article's comment preview here (the web's `CommentList preview`).
const ArticleCommentsSlot: FC<Props> = () => null;

export default ArticleCommentsSlot;

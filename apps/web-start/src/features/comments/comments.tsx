import type { FC } from 'react';

import type {
    AppCommentsSchemasContentTypeEnum as CommentsContentType,
    CommentResponse,
} from '@hikka/api';

import Comment from './comment';

type Props = {
    comments: CommentResponse[];
    slug: string;
    content_type: CommentsContentType;
};

const Comments: FC<Props> = ({ comments, slug, content_type }) => {
    return (
        <div className="flex w-full flex-col gap-6">
            {comments.map((comment) => (
                <Comment
                    slug={slug}
                    content_type={content_type}
                    comment={comment}
                    key={comment.reference}
                />
            ))}
        </div>
    );
};

export default Comments;

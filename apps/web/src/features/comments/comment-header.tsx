import type { FC } from 'react';

import { uk } from 'date-fns/locale/uk';

import type {
    CommentResponse,
    CommentContentTypeEnum as CommentsContentType,
} from '@hikka/api';

import AuthorMetaRow from '@/components/author-meta-row';
import { ReviewBadge } from '@/components/badges';

import CommentMenu from './comment-menu';

type Props = {
    comment: CommentResponse;
    slug: string;
    content_type: CommentsContentType;
};

const CommentHeader: FC<Props> = ({ comment, slug, content_type }) => {
    return (
        <div className="relative flex min-w-0 flex-col gap-2 pr-9">
            <AuthorMetaRow
                username={comment.author.username}
                role={comment.author.role}
                created={comment.created}
                locale={uk}
            />
            {comment.review?.recommended && (
                <div className="flex">
                    <ReviewBadge recommended={comment.review.recommended} />
                </div>
            )}
            {!comment.hidden && (
                <div className="absolute top-0 right-0">
                    <CommentMenu
                        comment={comment}
                        slug={slug}
                        content_type={content_type}
                    />
                </div>
            )}
        </div>
    );
};

export default CommentHeader;

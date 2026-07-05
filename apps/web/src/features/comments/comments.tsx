import type { FC } from 'react';

import type {
    CommentResponse,
    CommentContentTypeEnum as CommentsContentType,
} from '@hikka/api';

import { cn } from '@/utils/cn';

import Comment from './comment';

type Props = {
    comments: CommentResponse[];
    slug: string;
    content_type: CommentsContentType;
    contentTitle?: string;
    nested?: boolean;
    onToggleThread?: () => void;
};

const Comments: FC<Props> = ({
    comments,
    slug,
    content_type,
    contentTitle,
    nested,
    onToggleThread,
}) => {
    return (
        <div className="flex w-full flex-col gap-6">
            {comments.map((comment, index) => {
                if (!nested) {
                    return (
                        <Comment
                            slug={slug}
                            content_type={content_type}
                            contentTitle={contentTitle}
                            comment={comment}
                            key={comment.reference}
                        />
                    );
                }

                const isLast = index === comments.length - 1;

                return (
                    <div className="relative" key={comment.reference}>
                        <span
                            aria-hidden="true"
                            className="thread-bar -top-6 -left-4 h-8"
                        />
                        <span
                            aria-hidden="true"
                            className="thread-elbow top-2 -left-4 w-4"
                        />
                        {!isLast && (
                            <span
                                aria-hidden="true"
                                className="thread-bar top-2 -bottom-6 -left-4"
                            />
                        )}
                        {onToggleThread && (
                            <button
                                type="button"
                                tabIndex={-1}
                                aria-hidden="true"
                                data-thread-hit
                                onClick={onToggleThread}
                                className={cn(
                                    'absolute -left-4 w-4',
                                    isLast ? '-top-6 h-11' : '-top-6 -bottom-6',
                                )}
                            />
                        )}
                        <Comment
                            slug={slug}
                            content_type={content_type}
                            contentTitle={contentTitle}
                            comment={comment}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Comments;

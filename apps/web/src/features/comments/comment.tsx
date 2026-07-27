import { type FC, useMemo, useState } from 'react';

import { CirclePlus } from 'lucide-react';

import type { CommentContentTypeEnum as CommentsContentType } from '@hikka/api';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';
import { HorizontalCardImage } from '@/components/ui/horizontal-card';
import Spinner from '@/components/ui/spinner';
import { StatItem } from '@/components/ui/stat-item';
import { useSession } from '@/features/auth/hooks/use-session';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { cn } from '@/utils/cn';
import { getDeclensionWord } from '@/utils/i18n/declension';

import CommentFooter from './comment-footer';
import CommentHeader from './comment-header';
import CommentInput from './comment-input';
import Comments from './comments';
import { useCommentThread } from './hooks';
import {
    buildCommentTree,
    type CommentNode,
    countCommentNodes,
    flattenCommentNodes,
} from './utils/build-comment-tree';
import { mergePendingReplies } from './utils/merge-pending-replies';

type Props = {
    comment: CommentNode;
    slug: string;
    content_type: CommentsContentType;
    contentTitle?: string;
};

const Comment: FC<Props> = ({ comment, slug, content_type, contentTitle }) => {
    const { active, setReply, pendingReplies, lazyThread } =
        useCommentsContext();
    const [expand, setExpand] = useState<boolean>(comment.depth < 2);

    const { user: loggedUser } = useSession();

    const isReplyActive =
        active?.type === 'reply' && active.reference === comment.reference;
    const isEditActive =
        active?.type === 'edit' && active.reference === comment.reference;

    const addReplyInput = () => {
        setReply(comment.reference);
        setExpand(true);
    };

    const [threadRequested, setThreadRequested] = useState(false);

    const {
        list: threadRows,
        hasNextPage: threadHasNextPage,
        fetchNextPage: fetchThreadPage,
        isFetching: isThreadFetching,
        isError: isThreadError,
        refetch: refetchThread,
    } = useCommentThread(comment.reference, threadRequested);

    const serverChildren = useMemo(() => {
        if (!threadRows) return comment.children;

        // Union, not replace — thread rows go last so they win the dedupe.
        return buildCommentTree([
            ...flattenCommentNodes(comment.children),
            ...threadRows.filter((row) => row.reference !== comment.reference),
        ]);
    }, [threadRows, comment.children, comment.reference]);

    const allReplies = useMemo(
        () =>
            mergePendingReplies(
                serverChildren,
                pendingReplies,
                comment.reference,
            ),
        [pendingReplies, serverChildren, comment.reference],
    );

    const loadedReplies = countCommentNodes(allReplies);

    // `total_replies` counts deleted comments, so it over-promises until the
    // first request settles. Errors stay mounted as the retry affordance.
    const hasMoreReplies =
        lazyThread &&
        (threadRequested
            ? threadHasNextPage || isThreadFetching || isThreadError
            : (comment.total_replies ?? 0) > loadedReplies);

    const replyCount = Math.max(loadedReplies, comment.total_replies ?? 0);

    const hasReplies = allReplies.length > 0;

    const loadMoreReplies = () => {
        if (isThreadError) {
            refetchThread();
        } else if (threadRequested) {
            fetchThreadPage();
        } else {
            setThreadRequested(true);
        }
    };

    const expandReplies = () => {
        if (isThreadError) refetchThread();
        else if (hasMoreReplies && !threadRequested) setThreadRequested(true);
        setExpand(true);
    };

    const toggleThread = () => {
        if (!expand && hasMoreReplies && !threadRequested) {
            setThreadRequested(true);
        }
        setExpand((prev) => !prev);
    };

    return (
        <div
            className="comment-thread flex w-full scroll-mt-20 flex-col"
            id={comment.reference}
        >
            <div className="flex gap-4">
                <div className="relative isolate w-10 shrink-0">
                    <HorizontalCardImage
                        className="relative z-10 w-10"
                        image={comment.author.avatar}
                        imageRatio={1}
                        to={`/u/${comment.author.username}`}
                    />
                    {(hasReplies || hasMoreReplies) && (
                        <button
                            type="button"
                            data-thread-hit
                            className={cn(
                                'absolute inset-x-0 top-5',
                                expand && hasReplies ? 'bottom-0' : 'bottom-7',
                            )}
                            onClick={toggleThread}
                            aria-label={
                                expand
                                    ? 'Згорнути відповіді'
                                    : 'Показати відповіді'
                            }
                        >
                            <span className="thread-bar inset-y-0 left-0" />
                        </button>
                    )}
                </div>

                <div className="relative flex min-w-0 flex-1 flex-col gap-3">
                    <CommentHeader
                        comment={comment}
                        slug={slug}
                        content_type={content_type}
                    />

                    {!comment.hidden ? (
                        isEditActive ? (
                            <CommentInput
                                slug={slug}
                                content_type={content_type}
                                contentTitle={contentTitle}
                                comment={comment}
                                isEdit
                            />
                        ) : (
                            <TextExpand>
                                <MDViewer className="text-[0.9375rem]">
                                    {comment.text}
                                </MDViewer>
                            </TextExpand>
                        )
                    ) : (
                        <p className="text-[0.9375rem] text-muted-foreground">
                            Коментар видалено
                        </p>
                    )}

                    <CommentFooter
                        comment={comment}
                        onReply={addReplyInput}
                        canReply={!!loggedUser}
                    />

                    {isReplyActive && (
                        <CommentInput
                            slug={slug}
                            content_type={content_type}
                            contentTitle={contentTitle}
                            comment={comment}
                        />
                    )}

                    {((!expand && hasReplies) ||
                        (!hasReplies && hasMoreReplies)) && (
                        <div className="relative flex items-start">
                            <span
                                aria-hidden="true"
                                className="thread-elbow top-1 -left-14 w-14"
                            />
                            <StatItem data-thread-hit onClick={expandReplies}>
                                {isThreadFetching ? (
                                    <Spinner />
                                ) : (
                                    <CirclePlus />
                                )}
                                {replyCount}{' '}
                                {getDeclensionWord(replyCount, [
                                    'відповідь',
                                    'відповіді',
                                    'відповідей',
                                ])}
                            </StatItem>
                        </div>
                    )}
                </div>
            </div>

            {expand && hasReplies && (
                <div className="mt-6 ml-4">
                    <Comments
                        slug={slug}
                        content_type={content_type}
                        contentTitle={contentTitle}
                        comments={allReplies}
                        nested
                        hasTrailing={hasMoreReplies}
                        onToggleThread={toggleThread}
                    />
                    {hasMoreReplies && (
                        <div className="relative mt-6 flex items-start">
                            <span
                                aria-hidden="true"
                                className="thread-bar -top-6 -left-4 h-8"
                            />
                            <span
                                aria-hidden="true"
                                className="thread-elbow top-1 -left-4 w-4"
                            />
                            <StatItem data-thread-hit onClick={loadMoreReplies}>
                                {isThreadFetching ? (
                                    <Spinner />
                                ) : (
                                    <CirclePlus />
                                )}
                                {isThreadError
                                    ? 'Не вдалося завантажити, спробувати ще'
                                    : 'Більше відповідей'}
                            </StatItem>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Comment;

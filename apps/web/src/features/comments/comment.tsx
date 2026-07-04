import { type FC, useMemo, useState } from 'react';

import { CirclePlus } from 'lucide-react';

import type {
    CommentResponse,
    CommentContentTypeEnum as CommentsContentType,
} from '@hikka/api';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';
import { HorizontalCardImage } from '@/components/ui/horizontal-card';
import { StatItem } from '@/components/ui/stat-item';
import { useSession } from '@/features/auth/hooks/use-session';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { cn } from '@/utils/cn';
import { getDeclensionWord } from '@/utils/i18n/declension';

import CommentFooter from './comment-footer';
import CommentHeader from './comment-header';
import CommentInput from './comment-input';
import Comments from './comments';

type Props = {
    comment: CommentResponse;
    slug: string;
    content_type: CommentsContentType;
};

const Comment: FC<Props> = ({ comment, slug, content_type }) => {
    const { active, setReply, pendingReplies } = useCommentsContext();
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

    const { replies: allReplies, hasPending: hasPendingForThis } =
        useMemo(() => {
            const serverRepliesAll = comment.replies ?? [];
            if (pendingReplies.length === 0)
                return { replies: serverRepliesAll, hasPending: false };

            const relevant = pendingReplies.filter(
                (r) => r.comment.parent === comment.reference,
            );
            const hasPending = relevant.length > 0;
            const prepend = relevant
                .filter((r) => !r.insertAfter)
                .map((r) => r.comment);
            const insertAfters = relevant.filter((r) => r.insertAfter);
            const pendingRefs = new Set([
                ...prepend.map((c) => c.reference),
                ...insertAfters.map((r) => r.comment.reference),
            ]);
            const serverReplies = serverRepliesAll.filter(
                (r) => !pendingRefs.has(r.reference),
            );

            const insertAfterMap = new Map<string, CommentResponse[]>();
            for (const entry of insertAfters) {
                const key = entry.insertAfter;
                if (!key) continue;
                const list = insertAfterMap.get(key) ?? [];
                list.push(entry.comment);
                insertAfterMap.set(key, list);
            }

            const merged = [...prepend, ...serverReplies];
            if (insertAfterMap.size === 0)
                return { replies: merged, hasPending };

            return {
                replies: merged.flatMap((r) => {
                    const after = insertAfterMap.get(r.reference);
                    return after ? [r, ...after] : [r];
                }),
                hasPending,
            };
        }, [pendingReplies, comment.replies, comment.reference]);

    const replyCount = hasPendingForThis
        ? allReplies.length
        : (comment.total_replies ?? 0);

    const hasReplies = allReplies.length > 0;

    const toggleThread = () => setExpand((prev) => !prev);

    return (
        <div
            className="comment-thread flex w-full scroll-mt-20 flex-col"
            id={comment.reference}
        >
            <div className="flex gap-4">
                <div className="relative w-10 shrink-0">
                    <HorizontalCardImage
                        className="relative z-10 w-10"
                        image={comment.author.avatar}
                        imageRatio={1}
                        to={`/u/${comment.author.username}`}
                    />
                    {hasReplies && (
                        <button
                            type="button"
                            data-thread-hit
                            className={cn(
                                'absolute inset-x-0 top-5',
                                expand ? 'bottom-0' : 'bottom-7',
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
                            comment={comment}
                        />
                    )}

                    {!expand && hasReplies && (
                        <div className="relative flex items-start">
                            <span
                                aria-hidden="true"
                                className="thread-elbow top-1 -left-14 w-14"
                            />
                            <StatItem
                                data-thread-hit
                                onClick={() => setExpand(true)}
                            >
                                <CirclePlus />
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
                        comments={allReplies}
                        nested
                        onToggleThread={toggleThread}
                    />
                </div>
            )}
        </div>
    );
};

export default Comment;

import { type FC, useMemo, useState } from 'react';

import { formatDistance } from 'date-fns';
import { uk } from 'date-fns/locale/uk';

import type {
    AppCommentsSchemasContentTypeEnum as CommentsContentType,
    CommentResponse,
} from '@hikka/api';
import { useSession } from '@/features/auth/hooks/use-session';

import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import MaterialSymbolsLinkRounded from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import MaterialSymbolsSecurity from '@/components/icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '@/components/icons/material-symbols/MaterialSymbolsShieldPerson';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import TextExpand from '@/components/text-expand';
import { Button } from '@/components/ui/button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { getDeclensionWord } from '@/utils/i18n/declension';
import { Link } from '@/utils/navigation';

import CommentInput from './comment-input';
import CommentMenu from './comment-menu';
import CommentVote from './comment-vote';
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

    const allReplies = useMemo<CommentResponse[]>(() => {
        const serverRepliesAll = comment.replies ?? [];
        if (pendingReplies.length === 0) return serverRepliesAll;

        const relevant = pendingReplies.filter(
            (r) => r.comment.parent === comment.reference,
        );
        // TODO(phase2): drop cast once comments-provider is migrated to @hikka/api types
        const prepend = relevant
            .filter((r) => !r.insertAfter)
            .map((r) => r.comment as unknown as CommentResponse);
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
            const key = entry.insertAfter!;
            const list = insertAfterMap.get(key) ?? [];
            // TODO(phase2): drop cast once comments-provider is migrated to @hikka/api types
            list.push(entry.comment as unknown as CommentResponse);
            insertAfterMap.set(key, list);
        }

        const merged = [...prepend, ...serverReplies];
        if (insertAfterMap.size === 0) return merged;

        return merged.flatMap((r) => {
            const after = insertAfterMap.get(r.reference);
            return after ? [r, ...after] : [r];
        });
    }, [pendingReplies, comment.replies, comment.reference]);

    const getDeclensedReplyCount = () => {
        const hasPendingForThis = pendingReplies.some(
            (r) => r.comment.parent === comment.reference,
        );
        const repliesCount = hasPendingForThis
            ? allReplies.length
            : (comment.total_replies ?? 0);

        return (
            repliesCount +
            ' ' +
            getDeclensionWord(repliesCount, [
                'відповідь',
                'відповіді',
                'відповідей',
            ])
        );
    };

    return (
        <div
            className="flex w-full scroll-mt-20 flex-col gap-2"
            id={comment.reference}
        >
            <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
                <HorizontalCard className="w-full gap-3">
                    <HorizontalCardImage
                        className="w-10"
                        image={comment.author.avatar}
                        imageRatio={1}
                        to={`/u/${comment.author.username}`}
                    />
                    <HorizontalCardContainer className="gap-1">
                        <div className="flex items-center gap-2">
                            <HorizontalCardTitle
                                href={`/u/${comment.author.username}`}
                            >
                                {comment.author.username}
                            </HorizontalCardTitle>
                            {(comment.author.role === 'admin' ||
                                comment.author.role === 'moderator') && (
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <div className="font-bold text-xs">
                                            {comment.author.role ===
                                                'admin' && (
                                                <MaterialSymbolsSecurity className="text-role-admin" />
                                            )}
                                            {comment.author.role ===
                                                'moderator' && (
                                                <MaterialSymbolsShieldPerson className="text-role-moderator" />
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-sm">
                                            {comment.author.role === 'admin'
                                                ? 'Адміністратор'
                                                : 'Модератор'}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        <HorizontalCardDescription>
                            {formatDistance(
                                comment.created * 1000,
                                Date.now(),
                                { addSuffix: true, locale: uk },
                            )}
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                    <CommentVote comment={comment} />
                </HorizontalCard>

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
            </div>
            <div className="flex w-full items-center gap-2">
                <Button
                    disabled={!loggedUser}
                    variant="link"
                    className="h-auto p-0 text-muted-foreground hover:text-primary-foreground hover:no-underline"
                    size="md"
                    onClick={addReplyInput}
                >
                    Відповісти
                </Button>

                <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground text-sm"
                    asChild
                >
                    <Link
                        to={`/comments/${content_type}/${slug}/${comment.reference}`}
                    >
                        <MaterialSymbolsLinkRounded />
                    </Link>
                </Button>

                {(loggedUser?.username === comment.author.username ||
                    loggedUser?.role === 'admin' ||
                    loggedUser?.role === 'moderator') &&
                    !comment.hidden && <CommentMenu comment={comment} />}
            </div>
            {isReplyActive && (
                <div className="flex gap-6">
                    <CommentInput
                        slug={slug}
                        content_type={content_type}
                        comment={comment}
                    />
                </div>
            )}
            {allReplies.length > 0 && (
                <div className="flex w-full">
                    {expand && (
                        <button
                            type="button"
                            className="group relative pr-6"
                            onClick={() => setExpand(false)}
                        >
                            <div className="h-full w-px bg-border transition-colors duration-100 group-hover:bg-primary-foreground" />
                        </button>
                    )}
                    {!expand && (
                        <Button
                            size="md"
                            variant="ghost"
                            className="text-primary-foreground"
                            onClick={() => setExpand(true)}
                        >
                            <MaterialSymbolsKeyboardArrowDownRounded />
                            {getDeclensedReplyCount()}
                        </Button>
                    )}
                    {expand && (
                        <Comments
                            slug={slug}
                            content_type={content_type}
                            comments={allReplies}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Comment;

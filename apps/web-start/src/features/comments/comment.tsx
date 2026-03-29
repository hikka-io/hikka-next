'use client';

import { CommentResponse, CommentsContentType } from '@hikka/client';
import { useSession } from '@hikka/react';
import { formatDistance } from 'date-fns';
import { uk } from 'date-fns/locale/uk';
import { FC, useMemo, useState } from 'react';

import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import MaterialSymbolsLinkRounded from '@/components/icons/material-symbols/MaterialSymbolsLinkRounded';
import MaterialSymbolsSecurity from '@/components/icons/material-symbols/MaterialSymbolsSecurity';
import MaterialSymbolsShieldPerson from '@/components/icons/material-symbols/MaterialSymbolsShieldPerson';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
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

interface Props {
    comment: CommentResponse;
    slug: string;
    content_type: CommentsContentType;
}

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

    const allReplies = useMemo(() => {
        if (pendingReplies.length === 0) return comment.replies;

        const prepend = pendingReplies.filter(
            (r) => r.comment.parent === comment.reference && !r.insertAfter,
        );
        const insertAfters = pendingReplies.filter(
            (r) => r.comment.parent === comment.reference && r.insertAfter,
        );
        const pendingRefs = new Set(
            [...prepend, ...insertAfters].map((r) => r.comment.reference),
        );
        const serverReplies = comment.replies.filter(
            (r) => !pendingRefs.has(r.reference),
        );

        const insertAfterMap = new Map<string, CommentResponse[]>();
        for (const entry of insertAfters) {
            const key = entry.insertAfter!;
            const list = insertAfterMap.get(key) ?? [];
            list.push(entry.comment);
            insertAfterMap.set(key, list);
        }

        const merged = [...prepend.map((r) => r.comment), ...serverReplies];
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
            : comment.total_replies;

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
                                        <div className="text-xs font-bold">
                                            {comment.author.role ===
                                                'admin' && (
                                                <MaterialSymbolsSecurity className="text-[#d0bfff]" />
                                            )}
                                            {comment.author.role ===
                                                'moderator' && (
                                                <MaterialSymbolsShieldPerson className="text-[#ffc9c9]" />
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
                    <p className="text-muted-foreground text-[0.9375rem]">
                        Коментар видалено
                    </p>
                )}
            </div>
            <div className="flex w-full items-center gap-2">
                <Button
                    disabled={!loggedUser}
                    variant="link"
                    className="text-muted-foreground hover:text-primary-foreground h-auto p-0 hover:no-underline"
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
                            className="group relative pr-6"
                            onClick={() => setExpand(false)}
                        >
                            <div className="bg-border group-hover:bg-primary-foreground h-full w-px transition-colors duration-100" />
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

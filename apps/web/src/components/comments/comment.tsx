import { CommentResponse, CommentsContentType } from '@hikka/client';
import { useSession } from '@hikka/react';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

import { useCommentsContext } from '@/services/providers/comments-provider';
import getDeclensionWord from '@/utils/get-declension-word';

import MaterialSymbolsKeyboardArrowDownRounded from '../icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import MaterialSymbolsLinkRounded from '../icons/material-symbols/MaterialSymbolsLinkRounded';
import MDViewer from '../markdown/viewer/MD-viewer';
import TextExpand from '../text-expand';
import P from '../typography/p';
import { Button } from '../ui/button';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '../ui/horizontal-card';
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
    const {
        currentReply,
        currentEdit,
        setState: setCommentsState,
    } = useCommentsContext();
    const [expand, setExpand] = useState<boolean>(comment.depth < 2);
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

    const { user: loggedUser } = useSession();

    const addReplyInput = () => {
        setCommentsState!((prev) => ({
            ...prev,
            currentReply: comment.reference,
        }));
        setIsInputVisible(true);
    };

    const getRepliesCount = (comments: CommentResponse[]) => {
        let count = comments.length;

        comments.forEach((comment) => {
            count += getRepliesCount(comment.replies);
        });

        return count;
    };

    const getDeclensedReplyCount = () => {
        const repliesCount = getRepliesCount(comment.replies);

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

    useEffect(() => {
        if (currentReply && currentReply === comment.reference) {
            setExpand(true);
        }
    }, [currentReply]);

    return (
        <div
            className="flex w-full scroll-mt-20 flex-col gap-2"
            id={comment.reference}
        >
            <div className="flex w-full flex-col items-start gap-2">
                <HorizontalCard
                    className="w-full gap-3"
                    href={`/u/${comment.author.username}`}
                >
                    <HorizontalCardImage
                        className="w-10"
                        image={comment.author.avatar}
                        imageRatio={1}
                    />
                    <HorizontalCardContainer className="gap-1">
                        <HorizontalCardTitle>
                            {comment.author.username}
                        </HorizontalCardTitle>
                        <HorizontalCardDescription>
                            {formatDistance(
                                comment.created * 1000,
                                Date.now(),
                                { addSuffix: true },
                            )}
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                    <CommentVote comment={comment} />
                </HorizontalCard>

                {!comment.hidden ? (
                    currentEdit === comment.reference ? (
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
                            {/* <StaticViewer value={comment.text} /> */}
                        </TextExpand>
                    )
                ) : (
                    <P className="text-muted-foreground text-[0.9375rem]">
                        Коментар видалено
                    </P>
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
                        href={`/comments/${content_type}/${slug}/${comment.reference}`}
                    >
                        <MaterialSymbolsLinkRounded />
                    </Link>
                </Button>

                {(loggedUser?.username === comment.author.username ||
                    loggedUser?.role === 'admin' ||
                    loggedUser?.role === 'moderator') &&
                    !comment.hidden && <CommentMenu comment={comment} />}
            </div>
            {comment.replies.length > 0 && (
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
                            comments={comment.replies}
                        />
                    )}
                </div>
            )}
            {isInputVisible && currentReply === comment.reference && (
                <div className="flex gap-6">
                    <div className="-mt-2 h-auto w-px bg-white" />
                    <CommentInput
                        slug={slug}
                        content_type={content_type}
                        comment={comment}
                    />
                </div>
            )}
        </div>
    );
};

export default Comment;

import { useQueryClient } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import MaterialSymbolsKeyboardArrowDownRounded from '~icons/material-symbols/keyboard-arrow-down-rounded';
import MaterialSymbolsLinkRounded from '~icons/material-symbols/link-rounded';

import CommentInput from '@/components/comments/comment-input';
import CommentMenu from '@/components/comments/comment-menu';
import CommentVote from '@/components/comments/comment-vote';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import TextExpand from '@/components/text-expand';
import H5 from '@/components/typography/h5';
import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { useCommentsContext } from '@/services/providers/comments-provider';
import getDeclensionWord from '@/utils/get-declension-word';

import Comments from './comments';

interface Props {
    comment: API.Comment;
    slug: string;
    content_type: API.ContentType;
}

const Comment: FC<Props> = ({ comment, slug, content_type }) => {
    const queryClient = useQueryClient();
    const {
        currentReply,
        currentEdit,
        setState: setCommentsState,
    } = useCommentsContext();
    const [expand, setExpand] = useState<boolean>(comment.depth < 2);
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    const addReplyInput = () => {
        setCommentsState!((prev) => ({
            ...prev,
            currentReply: comment.reference,
        }));
        setIsInputVisible(true);
    };

    const getDeclensedReplyCount = () => {
        return (
            comment.replies.length +
            ' ' +
            getDeclensionWord(comment.replies.length, [
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
                <div className="flex w-full gap-3">
                    <Link href={`/u/${comment.author.username}`}>
                        <Avatar className="w-10 rounded-md">
                            <AvatarImage
                                className="rounded-md"
                                src={comment.author.avatar}
                                alt="avatar"
                            />
                            <AvatarFallback className="rounded-md">
                                {comment.author.username[0]}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                        <Link
                            href={`/u/${comment.author.username}`}
                            className="w-fit"
                        >
                            <H5>{comment.author.username}</H5>
                        </Link>

                        <Small className="text-muted-foreground">
                            {formatDistance(
                                comment.created * 1000,
                                Date.now(),
                                { addSuffix: true },
                            )}
                        </Small>
                    </div>
                    <CommentVote comment={comment} />
                </div>
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
                        </TextExpand>
                    )
                ) : (
                    <P className="text-[0.9375rem] text-muted-foreground">
                        Коментар видалено
                    </P>
                )}
            </div>
            <div className="flex w-full items-center gap-2">
                <Button
                    disabled={!loggedUser}
                    variant="link"
                    className="h-auto p-0 text-muted-foreground hover:text-primary hover:no-underline"
                    size="sm"
                    onClick={addReplyInput}
                >
                    Відповісти
                </Button>

                <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-sm text-muted-foreground"
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
                            <div className="h-full w-px bg-secondary transition-colors duration-100 group-hover:bg-primary" />
                        </button>
                    )}
                    {!expand && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary"
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

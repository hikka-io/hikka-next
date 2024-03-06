import { formatDistance } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import MaterialSymbolsKeyboardArrowDownRounded from '~icons/material-symbols/keyboard-arrow-down-rounded';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';

import CommentInput from '@/components/comments/ui/comment-input';
import CommentMenu from '@/components/comments/ui/comment-menu';
import CommentVote from '@/components/comments/ui/comment-vote';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useCommentsContext } from '@/services/providers/comments-provider';
import getDeclensionWord from '@/utils/getDeclensionWord';

import Comments from './comments';
import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import P from '@/components/typography/p';


interface Props {
    comment: API.Comment;
    slug: string;
    content_type: API.ContentType;
}

const Component = ({ comment, slug, content_type }: Props) => {
    const queryClient = useQueryClient();
    const { secret } = useAuthContext();
    const commentInputRef = useRef<HTMLDivElement>(null);
    const {
        currentReply,
        currentEdit,
        setState: setCommentsState,
    } = useCommentsContext();
    const [expand, setExpand] = useState<boolean>(comment.depth < 2);
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const addReplyInput = () => {
        setCommentsState!((prev) => ({
            ...prev,
            currentReply: comment.reference,
        }));
        setIsInputVisible(true);
    };

    const getDeclensedReplyCount = () => {
        return comment.replies.length + " " + getDeclensionWord(comment.replies.length, [
            'відповідь',
            'відповіді',
            'відповідей',
        ]);
    };

    useEffect(() => {
        if (currentReply && currentReply === comment.reference) {
            setExpand(true);
        }
    }, [currentReply]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-2 w-full items-start">
                <div className="flex gap-3 w-full">
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
                    <div className="flex flex-col justify-between flex-1">
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
                        <MDViewer>{comment.text}</MDViewer>
                    )
                ) : (
                    <P className="text-muted-foreground">Коментар видалено</P>
                )}
            </div>
            <div className="flex gap-2 w-full items-center">
                {comment.depth < 4 && (
                    <Button
                        disabled={!secret}
                        variant="link"
                        className="p-0 text-muted-foreground h-auto hover:text-primary hover:no-underline"
                        size="sm"
                        onClick={addReplyInput}
                    >
                        Відповісти
                    </Button>
                )}
                {(loggedUser?.username === comment.author.username ||
                    loggedUser?.role === 'admin' ||
                    loggedUser?.role === 'moderator') &&
                    !comment.hidden && <CommentMenu comment={comment} />}
            </div>
            {comment.replies.length > 0 && (
                <div className="flex w-full">
                    {expand && (
                        <button
                            className="pr-6 relative group"
                            onClick={() => setExpand(false)}
                        >
                            <div className="h-full w-[1px] bg-secondary transition-colors duration-100 group-hover:bg-primary" />
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
                    <div className="h-auto -mt-2 w-[1px] bg-white" />
                    <CommentInput
                        ref={commentInputRef}
                        slug={slug}
                        content_type={content_type}
                        comment={comment}
                    />
                </div>
            )}
        </div>
    );
};

export default Component;

import { formatDistance } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import MaterialSymbolsEditRounded from '~icons/material-symbols/edit-rounded';
import MaterialSymbolsKeyboardArrowDownRounded from '~icons/material-symbols/keyboard-arrow-down-rounded';
import MaterialSymbolsKeyboardArrowUpRounded from '~icons/material-symbols/keyboard-arrow-up-rounded';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

import Link from 'next/link';

import CommentInput from '@/app/_components/comment-input';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Label } from '@/app/_components/ui/label';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useCommentsContext } from '@/utils/providers/comments-provider';

import Comments from './comments';
import MDViewer from './md/viewer/MD-viewer';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
    comment: Hikka.Comment;
    slug: string;
    content_type: Hikka.ContentType;
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

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
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
        if (comment.replies.length % 10 === 1) {
            return `${comment.replies.length} відповідь`;
        }

        if (
            comment.replies.length % 10 > 1 &&
            comment.replies.length % 10 < 5
        ) {
            return `${comment.replies.length} відповіді`;
        }

        return `${comment.replies.length} відповідей`;
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
                            <h5>{comment.author.username}</h5>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                            {formatDistance(
                                comment.created * 1000,
                                Date.now(),
                                { addSuffix: true },
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center opacity-60 hover:opacity-100">
                        <Button
                            disabled={!secret}
                            variant="ghost"
                            size="icon-xs"
                            className="text-muted-foreground text-lg"
                        >
                            <MaterialSymbolsKeyboardArrowDownRounded />
                        </Button>
                        <Label>{comment.score}</Label>

                        <Button
                            disabled={!secret}
                            variant="ghost"
                            size="icon-xs"
                            className="text-muted-foreground text-lg"
                        >
                            <MaterialSymbolsKeyboardArrowUpRounded />
                        </Button>
                    </div>
                </div>
                {currentEdit === comment.reference ? (
                    <CommentInput
                        slug={slug}
                        content_type={content_type}
                        comment={comment}
                        isEdit
                    />
                ) : (
                    <MDViewer>{comment.text}</MDViewer>
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
                {loggedUser?.username === comment.author.username && <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-muted-foreground text-sm"
                        >
                            <MaterialSymbolsMoreHoriz />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            onClick={() =>
                                setCommentsState!((prev) => ({
                                    ...prev,
                                    currentEdit: comment.reference,
                                }))
                            }
                        >
                            <MaterialSymbolsEditRounded className="mr-2" />
                            Редагувати
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>}
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
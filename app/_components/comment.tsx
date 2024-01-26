import { formatDistance } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import MaterialSymbolsKeyboardArrowDownRounded from '~icons/material-symbols/keyboard-arrow-down-rounded';



import CommentInput from '@/app/_components/comment-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';
import { useCommentsContext } from '@/utils/providers/comments-provider';



import Comments from './comments';
import MDViewer from './md/viewer/MD-viewer';


interface Props {
    comment: Hikka.Comment;
    slug: string;
    content_type: 'edit';
}

const Component = ({ comment, slug, content_type }: Props) => {
    const commentInputRef = useRef<HTMLDivElement>(null);
    const {
        currentReply,
        setState: setCommentsState,
    } = useCommentsContext();
    const [expand, setExpand] = useState<boolean>(comment.depth < 2);
    const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

    const addReplyInput = () => {
        setCommentsState!((prev) => ({
            ...prev,
            currentReply: comment.reference,
        }));
        setIsInputVisible(true);
    };

    useEffect(() => {
        if (isInputVisible && currentReply === comment.reference) {
            commentInputRef.current?.scrollIntoView({block: "start", behavior: "smooth"});
        }
    }, [isInputVisible]);


    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-2 w-full items-start">
                <div className="flex gap-3">
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
                    <div className="flex flex-col justify-between">
                        <h5>{comment.author.username}</h5>
                        <p className="text-xs text-muted-foreground">
                            {formatDistance(
                                comment.created * 1000,
                                Date.now(),
                                { addSuffix: true },
                            )}
                        </p>
                    </div>
                </div>
                <MDViewer>{comment.text}</MDViewer>
            </div>
            <div className="flex flex-col gap-2 w-full items-start">
                <Button
                    variant="link"
                    className="p-0 text-muted-foreground hover:text-primary"
                    size="sm"
                    onClick={addReplyInput}
                >
                    Відповісти
                </Button>
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
                            {comment.replies.length} відповідей
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
                <div className="flex gap-2">
                    <div className="h-full w-[1px] bg-secondary" />
                    <CommentInput
                        ref={commentInputRef}
                        className="pl-6 scroll-mt-28"
                        slug={slug}
                        content_type={content_type}
                        parent={comment.reference}
                    />
                </div>
            )}
        </div>
    );
};

export default Component;
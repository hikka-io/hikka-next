'use client';

import { useSnackbar } from 'notistack';
import React, { ForwardedRef, forwardRef, useRef, useState } from 'react';
import MaterialSymbolsReplyRounded from '~icons/material-symbols/reply-rounded';



import { MDXEditorMethods } from '@mdxeditor/editor';
import { useQueryClient } from '@tanstack/react-query';



import MDEditor from '@/components/markdown/editor/MD-editor';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import addComment from '@/services/api/comments/addComment';
import editComment from '@/services/api/comments/editComment';
import useAuth from '@/services/hooks/auth/useAuth';

import { useCommentsContext } from '@/services/providers/comments-provider';
import { cn } from '@/utils';


interface Props {
    slug: string;
    content_type: API.ContentType;
    comment?: API.Comment;
    className?: string;
    isEdit?: boolean;
}

const Component = forwardRef(
    (
        { comment, slug, content_type, className, isEdit }: Props,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const { setState: setCommentsState } = useCommentsContext();
        const { enqueueSnackbar } = useSnackbar();
        const [isPosting, setIsPosting] = useState(false);
        const editorRef = useRef<MDXEditorMethods>(null);
        const queryClient = useQueryClient();
        const [text, setText] = useState(isEdit ? comment!.text : '');
        const { auth } = useAuth();

        const onSubmit = async () => {
            setIsPosting(true);

            try {
                if (isEdit) {
                    await editComment({
                        reference: comment!.reference,
                        auth: String(auth),
                        text: text,
                    });
                } else {
                    await addComment({
                        content_type: content_type,
                        slug: slug,
                        parent: comment?.depth
                            ? comment?.depth < 5
                                ? comment?.reference
                                : comment?.parent!
                            : undefined,
                        auth: String(auth),
                        text:
                            comment?.depth && comment?.depth >= 5
                                ? `@${comment.author.username} ${text}`
                                : text,
                    });
                }

                await queryClient.invalidateQueries({
                    queryKey: ['comments', slug],
                });

                setText('');
                editorRef.current?.setMarkdown('');

                if (comment) {
                    setCommentsState!((prev) => ({
                        ...prev,
                        currentReply: undefined,
                        currentEdit: undefined,
                    }));
                }
            } catch (e) {
                console.log(e);
                enqueueSnackbar(
                    'Виникла помилка при відправленні повідомлення. Спробуйте, будь ласка, ще раз',
                    { variant: 'error' },
                );
            }

            setIsPosting(false);
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'relative w-full',
                    'rounded-md border border-secondary/60 bg-secondary/30 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
                    className,
                )}
            >
                <MDEditor
                    autoFocus={!isEdit && Boolean(comment)}
                    placeholder="Напишіть повідомлення..."
                    ref={editorRef}
                    readOnly={isPosting}
                    className="dark-theme dark-editor"
                    markdown={text}
                    onChange={setText}
                />
                <div className="flex w-full items-center justify-between p-2">
                    {comment && !isEdit ? (
                        <Badge variant="secondary" className="gap-2 p-0 pr-2">
                            <Avatar className="size-6">
                                <AvatarImage
                                    className="size-6"
                                    src={comment.author.avatar}
                                />
                            </Avatar>
                            <Label className="hidden md:block">
                                {comment.author.username}
                            </Label>
                            <MaterialSymbolsReplyRounded />
                        </Badge>
                    ) : (
                        <div />
                    )}
                    <div className="flex gap-2">
                        {comment && (
                            <Button
                                onClick={() =>
                                    setCommentsState!((prev) => ({
                                        ...prev,
                                        currentReply: isEdit
                                            ? prev.currentReply
                                            : undefined,
                                        currentEdit: isEdit
                                            ? undefined
                                            : prev.currentEdit,
                                    }))
                                }
                                size="sm"
                                variant="outline"
                            >
                                Скасувати
                            </Button>
                        )}
                        <Button
                            disabled={isPosting || text.length === 0}
                            onClick={onSubmit}
                            size="sm"
                            type="submit"
                            variant="secondary"
                        >
                            {isPosting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            {isEdit ? 'Зберегти' : 'Відправити'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    },
);

export default Component;

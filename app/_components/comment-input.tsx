'use client';

import { useSnackbar } from 'notistack';
import React, { ForwardedRef, forwardRef, useRef, useState } from 'react';
import MaterialSymbolsReplyRounded from '~icons/material-symbols/reply-rounded';



import { MDXEditorMethods } from '@mdxeditor/editor';
import { useQueryClient } from '@tanstack/react-query';



import MDEditor from '@/app/_components/md/editor/MD-editor';
import { Avatar, AvatarImage } from '@/app/_components/ui/avatar';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { cn } from '@/utils';
import addComment from '@/utils/api/comments/addComment';
import editComment from '@/utils/api/comments/editComment';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useCommentsContext } from '@/utils/providers/comments-provider';


interface Props {
    slug: string;
    content_type: Hikka.ContentType;
    comment?: Hikka.Comment;
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
        const { secret } = useAuthContext();

        const onSubmit = async () => {
            setIsPosting(true);

            try {
                if (isEdit) {
                    await editComment({
                        reference: comment!.reference,
                        secret: String(secret),
                        text: text,
                    });
                } else {
                    await addComment({
                        content_type: content_type,
                        slug: slug,
                        parent: comment?.reference || undefined,
                        secret: String(secret),
                        text: text,
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
                    'bg-secondary/30 border-secondary/60 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
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
                <div className="p-2 flex justify-between items-center w-full">
                    {comment && !isEdit ? (
                        <Badge variant="secondary" className="p-0 pr-2 gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage
                                    className="w-6 h-6"
                                    src={comment.author.avatar}
                                />
                            </Avatar>
                            <Label>{comment.author.username}</Label>
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
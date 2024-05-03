'use client';

import React, { FC, ForwardedRef, forwardRef, useRef } from 'react';
import { useForm } from 'react-hook-form';
import MaterialSymbolsReplyRounded from '~icons/material-symbols/reply-rounded';

import { zodResolver } from '@hookform/resolvers/zod';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import FormMarkdown from '@/components/form/form-markdown';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import addComment from '@/services/api/comments/addComment';
import editComment from '@/services/api/comments/editComment';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { cn } from '@/utils/utils';
import { z } from '@/utils/zod';

interface Props {
    slug: string;
    content_type: API.ContentType;
    comment?: API.Comment;
    className?: string;
    isEdit?: boolean;
}

const formSchema = z.object({
    text: z.string(),
});

const CommentInput: FC<Props> = forwardRef(
    (
        { comment, slug, content_type, className, isEdit },
        ref: ForwardedRef<HTMLFormElement>,
    ) => {
        const { setState: setCommentsState } = useCommentsContext();
        const editorRef = useRef<MDXEditorMethods>(null);
        const queryClient = useQueryClient();

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: isEdit ? comment : undefined,
        });

        const onSuccess = async () => {
            await queryClient.invalidateQueries({
                queryKey: ['comments', slug],
            });

            editorRef.current?.setMarkdown('');

            if (comment) {
                setCommentsState!((prev) => ({
                    ...prev,
                    currentReply: undefined,
                    currentEdit: undefined,
                }));
            }
        };

        const { mutate: mutateEditComment, isPending: isEditPending } =
            useMutation({
                mutationFn: editComment,
                onSuccess,
            });

        const { mutate: mutateAddComment, isPending: isAddPending } =
            useMutation({
                mutationFn: addComment,
                onSuccess,
            });

        const handleCancel = () => {
            setCommentsState!((prev) => ({
                ...prev,
                currentReply: isEdit ? prev.currentReply : undefined,
                currentEdit: isEdit ? undefined : prev.currentEdit,
            }));
        };

        const onSubmit = (data: z.infer<typeof formSchema>) => {
            if (isEdit) {
                mutateEditComment({
                    params: {
                        reference: comment!.reference,
                        ...data,
                    },
                });
            } else {
                mutateAddComment({
                    params: {
                        content_type: content_type,
                        slug: slug,
                        parent: comment?.depth
                            ? comment?.depth < 5
                                ? comment?.reference
                                : comment?.parent!
                            : undefined,
                        text:
                            comment?.depth && comment?.depth >= 5
                                ? `@${comment.author.username} ${data.text}`
                                : data.text,
                    },
                });
            }
        };

        return (
            <Form {...form}>
                <form
                    ref={ref}
                    className={cn(
                        'relative w-full',
                        'rounded-md border border-secondary/60 bg-secondary/30 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
                        className,
                    )}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <FormMarkdown
                        name="text"
                        placeholder="Напишіть повідомлення..."
                        readOnly={isAddPending || isEditPending}
                        ref={editorRef}
                        autoFocus={!isEdit && Boolean(comment)}
                    />
                    <div className="flex w-full items-center justify-between p-2">
                        {comment && !isEdit ? (
                            <Badge
                                variant="secondary"
                                className="gap-2 p-0 pr-2"
                            >
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
                                    type="button"
                                    onClick={handleCancel}
                                    size="sm"
                                    variant="outline"
                                >
                                    Скасувати
                                </Button>
                            )}
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={isAddPending || isEditPending}
                                size="sm"
                                type="submit"
                                variant="secondary"
                            >
                                {(isAddPending || isEditPending) && (
                                    <span className="loading loading-spinner"></span>
                                )}
                                {isEdit ? 'Зберегти' : 'Відправити'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        );
    },
);

export default CommentInput;

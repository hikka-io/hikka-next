'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetEditor } from '@udecode/plate-common';
import { useEditorRef } from '@udecode/plate-common/react';
import { FC } from 'react';

import MaterialSymbolsReplyRounded from '@/components/icons/material-symbols/MaterialSymbolsReplyRounded';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import addComment from '@/services/api/comments/addComment';
import editComment from '@/services/api/comments/editComment';
import { useCommentsContext } from '@/services/providers/comments-provider';

import { serializeMd } from '../markdown/editor/plugins/markdown-plugin/serialize-md';

interface Props {
    slug: string;
    content_type: API.ContentType;
    comment?: API.Comment;
    className?: string;
    isEdit?: boolean;
}

const CommentInputBottomBar: FC<Props> = ({
    comment,
    slug,
    content_type,
    className,
    isEdit,
}) => {
    const { setState: setCommentsState } = useCommentsContext();
    const editor = useEditorRef();
    const queryClient = useQueryClient();

    const onSuccess = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['comments', slug, content_type],
            exact: false,
        });

        await queryClient.invalidateQueries({
            queryKey: ['comment-thread'],
            exact: false,
        });

        resetEditor(editor);

        if (comment) {
            setCommentsState!((prev) => ({
                ...prev,
                currentReply: undefined,
                currentEdit: undefined,
            }));
        }
    };

    const { mutate: mutateEditComment, isPending: isEditPending } = useMutation(
        {
            mutationFn: editComment,
            onSuccess,
        },
    );

    const { mutate: mutateAddComment, isPending: isAddPending } = useMutation({
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

    const onSubmit = () => {
        const text = serializeMd({ editor });

        if (isEdit) {
            mutateEditComment({
                params: {
                    reference: comment!.reference,
                    text,
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
                            ? `@${comment.author.username} ${text}`
                            : text,
                },
            });
        }
    };

    return (
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
                        type="button"
                        onClick={handleCancel}
                        size="md"
                        variant="outline"
                    >
                        Скасувати
                    </Button>
                )}
                <Button
                    onClick={onSubmit}
                    disabled={isAddPending || isEditPending}
                    size="md"
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
    );
};

export default CommentInputBottomBar;

'use client';

import { CommentResponse, CommentsContentType } from '@hikka/client';
import { useCreateComment, useUpdateComment } from '@hikka/react';
import { MarkdownPlugin } from '@platejs/markdown';
import { Value } from 'platejs';
import { FC } from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useCommentsContext } from '@/services/providers/comments-provider';

import MaterialSymbolsReplyRounded from '../icons/material-symbols/MaterialSymbolsReplyRounded';
import { useCommentEditor } from '../plate/editor/comment-kit';

interface Props {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
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
    const editor = useCommentEditor();

    const onSuccess = async () => {
        editor.tf.reset();

        if (comment) {
            setCommentsState!((prev) => ({
                ...prev,
                currentReply: undefined,
                currentEdit: undefined,
            }));
        }
    };

    const { mutate: mutateEditComment, isPending: isEditPending } =
        useUpdateComment({
            options: {
                onSuccess,
            },
        });

    const { mutate: mutateWriteComment, isPending: isAddPending } =
        useCreateComment({
            options: {
                onSuccess,
            },
        });

    const handleCancel = () => {
        setCommentsState!((prev) => ({
            ...prev,
            currentReply: isEdit ? prev.currentReply : undefined,
            currentEdit: isEdit ? undefined : prev.currentEdit,
        }));
    };

    const removeEmptyTextNodes = (value: Value) => {
        return value.filter((node, index) =>
            node.type === 'p' &&
            node.children[0].text === '' &&
            (index === 0 || index === value.length - 1)
                ? false
                : true,
        );
    };

    const onSubmit = () => {
        const filteredValue = removeEmptyTextNodes(editor.children);

        if (filteredValue.length === 0) {
            return;
        }

        const text = editor.getApi(MarkdownPlugin).markdown.serialize({
            value: filteredValue,
        });

        if (isEdit) {
            mutateEditComment({
                commentReference: comment!.reference,
                args: {
                    text,
                },
            });
        } else {
            mutateWriteComment({
                contentType: content_type,
                slug: slug,
                args: {
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
        <div className="pointer-events-none bottom-0 flex w-full items-center justify-between border-t border-border bg-secondary/20 p-2 md:absolute md:border-t-0 md:bg-transparent">
            {comment && !isEdit ? (
                <Badge variant="secondary" className="gap-2 p-0 pr-2">
                    <Avatar className="size-6 rounded-sm">
                        <AvatarImage
                            className="size-6 rounded-sm"
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
                        className="pointer-events-auto"
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
                    className="pointer-events-auto"
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

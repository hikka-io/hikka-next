'use client';

import { CommentResponse, CommentsContentType } from '@hikka/client';
import { useCreateComment, useUpdateComment } from '@hikka/react';
import { MarkdownPlugin } from '@platejs/markdown';
import { Send } from 'lucide-react';
import { Value } from 'platejs';
import { FC } from 'react';

import MaterialSymbolsReplyRounded from '@/components/icons/material-symbols/MaterialSymbolsReplyRounded';
import { useMarkdownEditor } from '@/components/plate/editor/markdown-editor-kit';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FixedMarkdownToolbarButtons } from '@/components/plate/ui/fixed-toolbar-buttons';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useCommentsContext } from '@/services/providers/comments-provider';

interface Props {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
    className?: string;
    isEdit?: boolean;
    onClose?: () => void;
}

const CommentInputBottomBar: FC<Props> = ({
    comment,
    slug,
    content_type,
    className,
    isEdit,
    onClose,
}) => {
    const { setState: setCommentsState } = useCommentsContext();
    const editor = useMarkdownEditor();

    const onSuccess = async () => {
        editor.tf.reset();

        if (comment) {
            setCommentsState?.((prev) => ({
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
        setCommentsState?.((prev) => ({
            ...prev,
            currentReply: isEdit ? prev.currentReply : undefined,
            currentEdit: isEdit ? undefined : prev.currentEdit,
        }));
        onClose?.();
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
        <FixedToolbar className="bg-secondary/20 sticky bottom-0 gap-4 self-start rounded-b-md border-t p-2 backdrop-blur">
            <FixedMarkdownToolbarButtons className="-m-2 p-2" />
            <div className="flex justify-between gap-2">
                {comment && !isEdit && (
                    <Badge
                        variant="secondary"
                        className="gap-2 p-0 pr-2 md:pointer-events-auto"
                    >
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
                )}
                <div className="flex gap-2 md:pointer-events-auto">
                    <Button
                        type="button"
                        onClick={handleCancel}
                        size="sm"
                        variant="outline"
                        className={comment ? '' : 'md:hidden'}
                    >
                        Скасувати
                    </Button>

                    <Button
                        onClick={onSubmit}
                        disabled={isAddPending || isEditPending}
                        size="sm"
                        type="submit"
                    >
                        {isAddPending || isEditPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <Send />
                        )}
                        {isEdit ? 'Зберегти' : 'Відправити'}
                    </Button>
                </div>
            </div>
        </FixedToolbar>
    );
};

export default CommentInputBottomBar;

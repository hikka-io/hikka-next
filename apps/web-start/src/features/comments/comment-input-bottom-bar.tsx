'use client';

import { CommentResponse, CommentsContentType } from '@hikka/client';
import { useCreateComment, useUpdateComment } from '@hikka/react';
import { MarkdownPlugin } from '@platejs/markdown';
import { Minimize2, Send } from 'lucide-react';
import { FC } from 'react';

import { useMarkdownEditor } from '@/components/plate/editor/markdown-editor-kit';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FixedMarkdownToolbarButtons } from '@/components/plate/ui/fixed-toolbar-buttons';
import { Button } from '@/components/ui/button';

import { useCommentsContext } from '@/services/providers/comments-provider';
import { MAX_COMMENT_DEPTH } from '@/utils/constants/common';
import { removeEmptyTextNodes } from '@/utils/plate';

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
    const { clearActive, addPendingReply, updatePendingReply } =
        useCommentsContext();
    const editor = useMarkdownEditor();

    const onEditSuccess = async (data: CommentResponse) => {
        editor.tf.reset();
        updatePendingReply(data.reference, data);

        if (comment) {
            clearActive();
        }
    };

    const onCreateSuccess = async (data: CommentResponse) => {
        editor.tf.reset();

        if (comment) {
            if (comment.depth >= MAX_COMMENT_DEPTH) {
                addPendingReply({
                    comment: data,
                    insertAfter: comment.reference,
                });
            } else {
                addPendingReply({ comment: data });
            }
            clearActive();
        }
    };

    const { mutate: mutateEditComment, isPending: isEditPending } =
        useUpdateComment({
            options: {
                onSuccess: onEditSuccess,
            },
        });

    const { mutate: mutateWriteComment, isPending: isAddPending } =
        useCreateComment({
            options: {
                onSuccess: onCreateSuccess,
            },
        });

    const handleCancel = () => {
        clearActive();
        onClose?.();
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
                        ? comment?.depth < MAX_COMMENT_DEPTH
                            ? comment?.reference
                            : comment?.parent!
                        : undefined,
                    text:
                        comment?.depth && comment?.depth >= MAX_COMMENT_DEPTH
                            ? `@${comment.author.username} ${text}`
                            : text,
                },
            });
        }
    };

    return (
        <FixedToolbar className="gap-4 px-2 py-2">
            <FixedMarkdownToolbarButtons className="-mx-2 -my-2 px-2 py-2" />
            <div className="flex justify-between gap-2">
                <div className="flex gap-2 md:pointer-events-auto">
                    <Button
                        type="button"
                        onClick={handleCancel}
                        size="sm"
                        variant="outline"
                        className={comment ? '' : 'md:hidden'}
                    >
                        <Minimize2 />
                        <span className="hidden md:inline">Скасувати</span>
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
                        <span className="hidden md:inline">
                            {isEdit ? 'Зберегти' : 'Відправити'}
                        </span>
                    </Button>
                </div>
            </div>
        </FixedToolbar>
    );
};

export default CommentInputBottomBar;

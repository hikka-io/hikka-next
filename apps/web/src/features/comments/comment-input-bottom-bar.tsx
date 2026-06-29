import type { FC } from 'react';

import { MarkdownPlugin } from '@platejs/markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Minimize2, Send } from 'lucide-react';

import {
    type CommentResponse,
    type CommentContentTypeEnum as CommentsContentType,
    editCommentMutation,
    writeCommentMutation,
} from '@hikka/api';

import { useMarkdownEditor } from '@/components/plate/editor/markdown-editor-kit';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FixedMarkdownToolbarButtons } from '@/components/plate/ui/fixed-toolbar-buttons';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { invalidateComments } from '@/utils/api/invalidate-content-state';
import { MAX_COMMENT_DEPTH } from '@/utils/constants/common';
import { removeEmptyTextNodes } from '@/utils/plate';

type Props = {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
    className?: string;
    isEdit?: boolean;
    onClose?: () => void;
};

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
    const queryClient = useQueryClient();
    const editor = useMarkdownEditor();

    const onEditSuccess = async (data: CommentResponse) => {
        editor.tf.reset();
        updatePendingReply(data.reference, data);
        invalidateComments(queryClient);

        if (comment) {
            clearActive();
        }
    };

    const onCreateSuccess = async (data: CommentResponse) => {
        editor.tf.reset();
        invalidateComments(queryClient);

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

    const { mutate: mutateEditComment, isPending: isEditPending } = useMutation(
        {
            ...editCommentMutation(),
            onSuccess: onEditSuccess,
        },
    );

    const { mutate: mutateWriteComment, isPending: isAddPending } = useMutation(
        {
            ...writeCommentMutation(),
            onSuccess: onCreateSuccess,
        },
    );

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
                path: {
                    comment_reference: comment!.reference,
                },
                body: {
                    text,
                },
            });
        } else {
            mutateWriteComment({
                path: {
                    content_type,
                    slug,
                },
                body: {
                    parent: comment?.depth
                        ? comment?.depth < MAX_COMMENT_DEPTH
                            ? comment?.reference
                            : comment.parent!
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
                        {isAddPending || isEditPending ? <Spinner /> : <Send />}
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

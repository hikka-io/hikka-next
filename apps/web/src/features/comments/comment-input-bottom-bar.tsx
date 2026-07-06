import type { FC } from 'react';

import { MarkdownPlugin } from '@platejs/markdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Minimize2, Send } from 'lucide-react';
import { useEditorSelector } from 'platejs/react';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldTitle } from '@/components/ui/field';
import Spinner from '@/components/ui/spinner';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { invalidateComments } from '@/utils/api/invalidate-content-state';
import { MAX_COMMENT_DEPTH } from '@/utils/constants/common';
import { removeEmptyTextNodes } from '@/utils/plate';

import type { Verdict } from './utils/review';
import { toReviewArgs } from './utils/review';

type Props = {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
    className?: string;
    isEdit?: boolean;
    onClose?: () => void;
    showReviewToggle?: boolean;
    isReview?: boolean;
    verdict?: Verdict | null;
    onToggleReview?: (next: boolean) => void;
};

const CommentInputBottomBar: FC<Props> = ({
    comment,
    slug,
    content_type,
    isEdit,
    onClose,
    showReviewToggle,
    isReview = false,
    verdict = null,
    onToggleReview,
}) => {
    const { clearActive, addPendingReply, updatePendingReply } =
        useCommentsContext();
    const queryClient = useQueryClient();
    const editor = useMarkdownEditor();

    // Reactive emptiness — mirrors the onSubmit guard so the send button
    // stays disabled until there is real content to post.
    const hasContent = useEditorSelector(
        (editor) => removeEmptyTextNodes(editor.children).length > 0,
        [],
    );

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

        if (isReview) {
            onToggleReview?.(false);
        }

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
        } else {
            // Root composer: close the mobile sheet after a successful post.
            onClose?.();
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

        if (isReview && !verdict) {
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
                    review: toReviewArgs(isReview, verdict),
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
                    review: toReviewArgs(isReview, verdict),
                },
            });
        }
    };

    return (
        <FixedToolbar className="flex-col items-stretch justify-start gap-2 rounded-none px-2 py-2 md:flex-row md:items-center md:justify-between">
            <FixedMarkdownToolbarButtons className="-mx-2 -my-2 flex-none px-2 py-2 md:flex-1" />
            <div className="flex items-center gap-2 md:shrink-0">
                {/* Inline reply/edit (desktop) has no sheet header close, so it
                    keeps its own cancel. In the mobile sheet the top close
                    handles it, so we drop this redundant button there. */}
                {comment && !onClose && (
                    <Button
                        type="button"
                        onClick={handleCancel}
                        size="icon-sm"
                        variant="outline"
                        className="h-10 md:h-8"
                    >
                        <Minimize2 />
                    </Button>
                )}

                {showReviewToggle && (
                    <FieldLabel className="h-10 w-fit! cursor-pointer whitespace-nowrap *:data-[slot=field]:h-full *:data-[slot=field]:items-center *:data-[slot=field]:px-2.5 *:data-[slot=field]:py-0 md:h-8">
                        <Field orientation="horizontal">
                            <Checkbox
                                checked={isReview}
                                onCheckedChange={(checked) =>
                                    onToggleReview?.(checked === true)
                                }
                                id="comment-review-checkbox"
                                name="comment-review-checkbox"
                            />
                            <FieldTitle>Відгук</FieldTitle>
                        </Field>
                    </FieldLabel>
                )}

                <Button
                    onClick={onSubmit}
                    disabled={
                        isAddPending ||
                        isEditPending ||
                        !hasContent ||
                        (isReview && !verdict)
                    }
                    size="sm"
                    type="submit"
                    className="h-10 flex-1 justify-center md:h-8 md:flex-none"
                >
                    {isAddPending || isEditPending ? <Spinner /> : <Send />}
                    <span>
                        {isEdit
                            ? 'Зберегти'
                            : isReview
                              ? 'Опублікувати відгук'
                              : 'Відправити'}
                    </span>
                </Button>
            </div>
        </FixedToolbar>
    );
};

export default CommentInputBottomBar;

import { type FC, useMemo } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Minimize2, Send } from 'lucide-react';
import type { Value } from 'platejs';
import { useEditorRef, useEditorSelector, useEditorValue } from 'platejs/react';

import {
    API_LIMITS,
    type CommentContentTypeEnum,
    type CommentResponse,
    editCommentMutation,
    writeCommentMutation,
} from '@hikka/api';

import CharacterCounter from '@/components/character-counter';
import {
    getCommentText,
    getCommentValue,
} from '@/components/plate/editor/value/submit-value';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FixedMarkdownToolbarButtons } from '@/components/plate/ui/fixed-toolbar-buttons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldTitle } from '@/components/ui/field';
import Spinner from '@/components/ui/spinner';
import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { invalidateComments } from '@/utils/api/invalidate-content-state';

import { useCommentsContext } from './comments-provider';
import type { Verdict } from './review/review';
import { toReviewArgs } from './review/review';

const MAX_COMMENT_DEPTH = 5;

const codePointLength = (text: string) => Array.from(text).length;

type Props = {
    slug: string;
    content_type: CommentContentTypeEnum;
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
    const editor = useEditorRef();

    // Mirrors the onSubmit guard so send stays disabled until there is content.
    const hasContent = useEditorSelector(
        (editor) => getCommentValue(editor).length > 0,
        [],
    );

    const replyMention =
        !isEdit && comment?.depth && comment.depth >= MAX_COMMENT_DEPTH
            ? `@${comment.author.username} `
            : '';
    const [countedValue] = useDebounce<Value>({
        value: useEditorValue(),
        delay: DEBOUNCE_MS.input,
    });
    const textLength = useMemo(
        () => codePointLength(getCommentText(editor, countedValue)),
        [editor, countedValue],
    );
    const sentLength = replyMention.length + textLength;
    const isTooLong = sentLength > API_LIMITS.commentText.max;

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
            // Root composer closes the mobile sheet; replies stay open.
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
        const text = getCommentText(editor);

        if (!text) {
            return;
        }

        if (
            replyMention.length + codePointLength(text) >
            API_LIMITS.commentText.max
        ) {
            return;
        }

        if (isReview && !verdict) {
            return;
        }

        if (isEdit && comment) {
            mutateEditComment({
                path: {
                    comment_reference: comment.reference,
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
                    text: `${replyMention}${text}`,
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

                <CharacterCounter
                    length={sentLength}
                    max={API_LIMITS.commentText.max}
                />

                <Button
                    onClick={onSubmit}
                    disabled={
                        isAddPending ||
                        isEditPending ||
                        !hasContent ||
                        isTooLong ||
                        (isReview && !verdict)
                    }
                    size="sm"
                    type="submit"
                    className="h-10 flex-1 justify-center md:h-8 md:flex-none"
                >
                    {isAddPending || isEditPending ? <Spinner /> : <Send />}
                    <span>{isEdit ? 'Зберегти' : 'Відправити'}</span>
                </Button>
            </div>
        </FixedToolbar>
    );
};

export default CommentInputBottomBar;

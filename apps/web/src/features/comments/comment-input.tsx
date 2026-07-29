import { type FC, useEffect, useState } from 'react';

import { Minimize2 } from 'lucide-react';
import { Plate } from 'platejs/react';

import type {
    CommentResponse,
    CommentContentTypeEnum as CommentsContentType,
} from '@hikka/api';

import { usePlateMarkdownSetup } from '@/components/plate/editor/markdown-editor-kit';
import { EditorPreview } from '@/components/plate/editor/plate-editor';
import { Editor, EditorContainer } from '@/components/plate/ui/editor';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useVisualViewportOffset } from '@/services/hooks/use-visual-viewport';
import { useCommentsContext } from '@/services/providers/comments-provider';
import { cn } from '@/utils/cn';

import CommentInputBottomBar from './comment-input-bottom-bar';
import CommentVerdictPicker from './comment-verdict-picker';
import type { Verdict } from './utils/review';
import { canToggleReview, getPlainTextLength } from './utils/review';

type Props = {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
    className?: string;
    isEdit?: boolean;
    contentTitle?: string;
    forceReview?: boolean;
};

const CommentInput: FC<Props> = ({
    className,
    comment,
    isEdit,
    contentTitle,
    forceReview,
    ...props
}) => {
    const { editor, isMobile, isModalOpen, setIsModalOpen, handleChange } =
        usePlateMarkdownSetup({
            value: isEdit && comment ? comment.text! : undefined,
            modalDefaultOpen: comment !== undefined,
        });

    const { clearActive } = useCommentsContext();
    const isExistingReview = !!isEdit && !!comment?.review;
    const [isReview, setIsReview] = useState(isExistingReview);
    const [verdict, setVerdict] = useState<Verdict | null>(
        comment?.review?.recommended ?? null,
    );

    const isReply = !!comment && !isEdit;
    const showReviewToggle = canToggleReview({
        contentType: props.content_type,
        isReply,
        parent: isEdit ? (comment?.parent ?? null) : null,
        isExistingReview,
    });

    // Follow the section's comment-type filter, but never retarget a draft the
    // user has already started — browsing reviews must not turn their
    // half-written comment into a review.
    useEffect(() => {
        if (isEdit || forceReview === undefined || !showReviewToggle) return;
        if (getPlainTextLength(editor.children) > 0) return;
        setIsReview(forceReview);
        if (!forceReview) {
            setVerdict(null);
        }
    }, [forceReview, showReviewToggle, isEdit, editor]);

    useVisualViewportOffset(!!isModalOpen);

    // Closing the sheet must also end the active editor, or it stays mounted behind it.
    const handleSheetOpenChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open && comment) {
            clearActive();
        }
    };

    useEffect(() => {
        if (comment) {
            setTimeout(() => editor.tf.focus(), 0);
        }
    }, [comment, editor.tf.focus]);

    if (isMobile === undefined) {
        return null;
    }

    const showVerdictPicker = showReviewToggle && isReview;

    const onToggleReview = (next: boolean) => {
        setIsReview(next);
        if (!next) {
            setVerdict(null);
        }
    };

    const placeholder = isReply
        ? `Відповідь для ${comment.author.username}...`
        : isReview
          ? 'Поділіться враженнями від тайтлу…'
          : 'Напишіть повідомлення...';

    const reviewProps = {
        showReviewToggle,
        isReview,
        verdict,
        onToggleReview,
    };

    const verdictCard = showVerdictPicker && (
        <CommentVerdictPicker value={verdict} onChange={setVerdict} />
    );

    return (
        <Plate editor={editor} onChange={handleChange}>
            {isMobile && (
                <Sheet
                    open={isModalOpen}
                    defaultOpen={comment !== undefined}
                    onOpenChange={handleSheetOpenChange}
                >
                    <SheetTrigger asChild>
                        <EditorPreview
                            buttonTitle={
                                isReview
                                    ? 'Написати відгук'
                                    : 'Написати коментар'
                            }
                            editButtonTitle={
                                isReview
                                    ? 'Редагувати відгук'
                                    : 'Редагувати коментар'
                            }
                            editor={editor}
                            isOpen={isModalOpen}
                        />
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        showCloseButton={false}
                        className="top-(--visual-viewport-offset-top,0px)! bottom-auto! h-(--visual-viewport-height,100dvh)!"
                        onOpenAutoFocus={(e) => {
                            e.preventDefault();
                            editor.tf.focus();
                        }}
                    >
                        <SheetHeader className="pr-12">
                            <SheetTitle>
                                {isReview ? 'Відгук' : 'Коментар'}
                            </SheetTitle>
                            {contentTitle && (
                                <SheetDescription>
                                    {contentTitle}
                                </SheetDescription>
                            )}
                        </SheetHeader>
                        <SheetClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                className="absolute top-2 right-3"
                                aria-label="Закрити"
                            >
                                <Minimize2 />
                            </Button>
                        </SheetClose>

                        <EditorContainer
                            variant="drawer"
                            className={cn('-m-4 w-auto', className)}
                        >
                            <Editor
                                variant="drawer"
                                placeholder={placeholder}
                            />
                            {verdictCard}
                            <CommentInputBottomBar
                                comment={comment}
                                isEdit={isEdit}
                                onClose={() => setIsModalOpen(false)}
                                {...reviewProps}
                                {...props}
                            />
                        </EditorContainer>
                    </SheetContent>
                </Sheet>
            )}

            {!isMobile && (
                <EditorContainer className={cn('overflow-hidden', className)}>
                    <Editor variant="comment" placeholder={placeholder} />
                    <div className="flex flex-col">
                        {verdictCard}
                        <CommentInputBottomBar
                            comment={comment}
                            isEdit={isEdit}
                            {...reviewProps}
                            {...props}
                        />
                    </div>
                </EditorContainer>
            )}
        </Plate>
    );
};

export default CommentInput;

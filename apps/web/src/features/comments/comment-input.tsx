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
import { supportsReviews } from './utils/review';

type Props = {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
    className?: string;
    isEdit?: boolean;
    contentTitle?: string;
};

const CommentInput: FC<Props> = ({
    className,
    comment,
    isEdit,
    contentTitle,
    ...props
}) => {
    const { editor, isMobile, isModalOpen, setIsModalOpen, handleChange } =
        usePlateMarkdownSetup({
            value: isEdit && comment ? comment.text! : undefined,
            modalDefaultOpen: comment !== undefined,
        });

    const { clearActive } = useCommentsContext();
    const [isReview, setIsReview] = useState(false);
    const [verdict, setVerdict] = useState<Verdict | null>(null);

    useVisualViewportOffset(!!isModalOpen);

    // Closing a reply/edit sheet (top close) must also end the active editor,
    // otherwise it stays mounted behind a hidden sheet.
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
    }, []);

    if (isMobile === undefined) {
        return null;
    }

    const isReply = !!comment && !isEdit;
    const showReviewUI =
        !isReply && !isEdit && supportsReviews(props.content_type);

    const onToggleReview = (next: boolean) => {
        setIsReview(next);
        if (!next) setVerdict(null);
    };

    const placeholder = isReply
        ? `Відповідь для ${comment.author.username}...`
        : isReview
          ? 'Поділіться враженнями від тайтлу…'
          : 'Напишіть повідомлення...';

    const reviewProps = {
        showReviewToggle: showReviewUI,
        isReview,
        verdict,
        onToggleReview,
    };

    const verdictCard = showReviewUI && isReview && (
        <CommentVerdictPicker
            value={verdict}
            onChange={setVerdict}
            onDismiss={() => onToggleReview(false)}
        />
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
                            buttonTitle="Написати коментар"
                            editButtonTitle="Редагувати коментар"
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
                                className="absolute top-3 right-3"
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

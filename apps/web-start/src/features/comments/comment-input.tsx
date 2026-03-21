'use client';

import { CommentResponse, CommentsContentType } from '@hikka/client';
import { Plate } from 'platejs/react';
import { FC } from 'react';

import { usePlateMarkdownSetup } from '@/components/plate/editor/markdown-editor-kit';
import { EditorPreview } from '@/components/plate/editor/plate-editor';
import { Editor, EditorContainer } from '@/components/plate/ui/editor';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

import { cn } from '@/utils/cn';

import CommentInputBottomBar from './comment-input-bottom-bar';

interface Props {
    slug: string;
    content_type: CommentsContentType;
    comment?: CommentResponse;
    className?: string;
    isEdit?: boolean;
}

const CommentInput: FC<Props> = ({ className, comment, isEdit, ...props }) => {
    const { editor, isMobile, isModalOpen, setIsModalOpen, handleChange } =
        usePlateMarkdownSetup({
            value: isEdit && comment ? comment.text! : undefined,
            modalDefaultOpen: comment !== undefined,
        });

    if (isMobile === undefined) {
        return null;
    }

    return (
        <Plate editor={editor} onChange={handleChange}>
            {isMobile && (
                <Sheet
                    open={isModalOpen}
                    defaultOpen={comment !== undefined}
                    onOpenChange={setIsModalOpen}
                >
                    <SheetTrigger asChild>
                        <EditorPreview
                            buttonTitle="Написати коментар"
                            editButtonTitle="Редагувати коментар"
                            editor={editor}
                            isOpen={isModalOpen}
                        />
                    </SheetTrigger>
                    <SheetContent side="bottom" className="top-(--visual-viewport-offset-top,0px)! bottom-auto! h-(--visual-viewport-height,100dvh)!">
                        <SheetHeader>
                            <SheetTitle>Коментар</SheetTitle>
                        </SheetHeader>

                        <EditorContainer
                            variant="drawer"
                            className={cn('-m-4 w-auto', className)}
                        >
                            <Editor
                                variant="drawer"
                                placeholder="Напишіть повідомлення..."
                            />
                            <CommentInputBottomBar
                                comment={comment}
                                isEdit={isEdit}
                                onClose={() => setIsModalOpen(false)}
                                {...props}
                            />
                        </EditorContainer>
                    </SheetContent>
                </Sheet>
            )}

            {!isMobile && (
                <EditorContainer className={cn(className)}>
                    <Editor
                        variant="comment"
                        placeholder="Напишіть повідомлення..."
                    />
                    <CommentInputBottomBar
                        comment={comment}
                        isEdit={isEdit}
                        {...props}
                    />
                </EditorContainer>
            )}
        </Plate>
    );
};

export default CommentInput;

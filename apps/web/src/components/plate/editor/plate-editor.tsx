'use client';

import { MarkdownPlugin } from '@platejs/markdown';
import { MessageCircleMore, MessageCirclePlus } from 'lucide-react';
import { Value } from 'platejs';
import { Plate, PlateEditor, usePlateEditor } from 'platejs/react';
import { useEffect, useState } from 'react';

import MDViewer from '@/components/markdown/viewer/MD-viewer';
import { Editor, EditorContainer } from '@/components/plate/ui/editor';
import TextExpand from '@/components/text-expand';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

import { useIsMobile } from '@/services/hooks/use-mobile';
import { cn } from '@/utils/utils';

import { ArticleKit } from './article-kit';
import { CommentKit } from './comment-kit';

function CommentPreview({
    editor,
    isOpen,
    buttonTitle,
    editButtonTitle,
    ...props
}: {
    editor: PlateEditor;
    isOpen: boolean;
    buttonTitle: string;
    editButtonTitle: string;
}) {
    const [preview, setPreview] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!isOpen) {
            setPreview(editor.getApi(MarkdownPlugin).markdown.serialize());
        }
    }, [isOpen]);

    if (editor.api.isEmpty()) {
        return (
            <Button variant="outline" className="w-full" {...props}>
                <MessageCirclePlus className="size-4" />
                {buttonTitle}
            </Button>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="w-full rounded-lg border p-4 text-left">
                <TextExpand>
                    <MDViewer className="text-[0.9375rem]">{preview}</MDViewer>
                </TextExpand>
            </div>
            <Button variant="outline" className="w-full" {...props}>
                <MessageCircleMore className="size-4" />
                {editButtonTitle}
            </Button>
        </div>
    );
}

export interface CommentPlateEditorProps {
    value?: string;
    children?: React.ReactNode;
    className?: string;
    placeholder?: string;
    modalDefaultOpen?: boolean;
    modalTitle?: string;
    modalButtonTitle?: string;
    modalEditButtonTitle?: string;
    onValueChange?: (value: string) => void;
}

export function CommentPlateEditor({
    value,
    children,
    className,
    placeholder = 'Напишіть повідомлення...',
    onValueChange,
    modalDefaultOpen,
    modalButtonTitle = 'Написати коментар',
    modalEditButtonTitle = 'Редагувати коментар',
    modalTitle = 'Коментар',
}: CommentPlateEditorProps) {
    const editor = usePlateEditor({
        plugins: CommentKit,
        value: (editor) =>
            editor.getApi(MarkdownPlugin).markdown.deserialize(value ?? ''),
    });

    const [isModalOpen, setIsModalOpen] = useState(modalDefaultOpen ?? false);
    const isMobile = useIsMobile();

    if (isMobile === undefined) {
        return null;
    }

    return (
        <Plate
            editor={editor}
            onValueChange={
                onValueChange
                    ? () =>
                          onValueChange(
                              editor
                                  .getApi(MarkdownPlugin)
                                  .markdown.serialize(),
                          )
                    : undefined
            }
        >
            {isMobile && (
                <Sheet
                    open={isModalOpen}
                    defaultOpen={modalDefaultOpen}
                    onOpenChange={setIsModalOpen}
                >
                    <SheetTrigger asChild>
                        <CommentPreview
                            buttonTitle={modalButtonTitle}
                            editButtonTitle={modalEditButtonTitle}
                            editor={editor}
                            isOpen={isModalOpen}
                        />
                    </SheetTrigger>
                    <SheetContent
                        className={cn('flex h-dvh flex-col gap-0 p-0')}
                        side="bottom"
                    >
                        <SheetHeader className="bg-secondary/20 py-4">
                            <SheetTitle>{modalTitle}</SheetTitle>
                        </SheetHeader>

                        <EditorContainer variant="drawer" className={className}>
                            <Editor
                                variant="drawer"
                                placeholder={placeholder}
                            />
                            {children}
                        </EditorContainer>
                    </SheetContent>
                </Sheet>
            )}

            {!isMobile && (
                <EditorContainer className={className}>
                    <Editor variant="comment" placeholder={placeholder} />
                    {children}
                </EditorContainer>
            )}
        </Plate>
    );
}

export interface ArticlePlateEditorProps {
    value?: Value;
    children?: React.ReactNode;
    className?: string;
    placeholder?: string;
    onValueChange?: (value: Value) => void;
}

export function ArticlePlateEditor({
    value,
    children,
    className,
    placeholder = 'Напишіть зміст статті...',
    onValueChange,
}: ArticlePlateEditorProps) {
    const editor = usePlateEditor({
        plugins: ArticleKit,
        value,
        nodeId: false,
    });

    return (
        <Plate
            editor={editor}
            onValueChange={
                onValueChange ? ({ value }) => onValueChange(value) : undefined
            }
        >
            <EditorContainer className={className}>
                <Editor variant="default" placeholder={placeholder} />
                {children}
            </EditorContainer>
        </Plate>
    );
}

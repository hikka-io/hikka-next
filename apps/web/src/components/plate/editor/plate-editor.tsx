import { useEffect, useState } from 'react';

import { MarkdownPlugin } from '@platejs/markdown';
import {
    MessageCircleMore,
    MessageCirclePlus,
    NotebookPen,
    SquarePen,
} from 'lucide-react';
import type { Value } from 'platejs';
import { Plate, type PlateEditor, usePlateEditor } from 'platejs/react';

import MDViewer from '@/components/markdown/viewer/md-viewer';
import { Editor, EditorContainer } from '@/components/plate/ui/editor';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FixedMarkdownToolbarButtons } from '@/components/plate/ui/fixed-toolbar-buttons';
import TextExpand from '@/components/text-expand';
import { Button } from '@/components/ui/button';
import {
    PageSheet,
    PageSheetContent,
    PageSheetHeader,
    PageSheetTrigger,
} from '@/components/ui/page-sheet';
import { useIsMobile } from '@/services/hooks/use-mobile';
import { useVisualViewportOffset } from '@/services/hooks/use-visual-viewport';
import { cn } from '@/utils/cn';

import { ArticleKit } from './article-kit';
import { usePlateMarkdownSetup } from './markdown-editor-kit';
import { ImageGroupPlugin } from './plugins/image-group-kit';
import { StaticViewer } from './static-viewer';
import { uploadAttachmentImage } from './upload-image';
import { useEditorApi } from './use-editor-api';

// Re-read on close rather than on every render: the editor keeps a stable
// identity, so anything derived from it during render is memoized forever.
function useClosedSnapshot<T>(isOpen: boolean, read: () => T) {
    const [snapshot, setSnapshot] = useState<T>(read);

    useEffect(() => {
        if (!isOpen) {
            setSnapshot(read());
        }
    }, [isOpen]);

    return snapshot;
}

function EditorPreviewFrame({
    isEmpty,
    icon,
    buttonTitle,
    children,
    ...props
}: React.ComponentProps<typeof Button> & {
    isEmpty: boolean;
    icon: React.ReactNode;
    buttonTitle: string;
}) {
    if (isEmpty) {
        return (
            <Button variant="outline" className="w-full" {...props}>
                {icon}
                {buttonTitle}
            </Button>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="w-full rounded-lg border p-4 text-left">
                <TextExpand>{children}</TextExpand>
            </div>
            <Button variant="outline" className="w-full" {...props}>
                {icon}
                {buttonTitle}
            </Button>
        </div>
    );
}

export function EditorPreview({
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
    const { markdown, isEmpty } = useClosedSnapshot(isOpen, () => ({
        markdown: editor.getApi(MarkdownPlugin).markdown.serialize(),
        isEmpty: editor.api.isEmpty(),
    }));

    return (
        <EditorPreviewFrame
            isEmpty={isEmpty}
            icon={
                isEmpty ? (
                    <MessageCirclePlus className="size-4" />
                ) : (
                    <MessageCircleMore className="size-4" />
                )
            }
            buttonTitle={isEmpty ? buttonTitle : editButtonTitle}
            {...props}
        >
            <MDViewer className="text-[0.9375rem]">{markdown}</MDViewer>
        </EditorPreviewFrame>
    );
}

function ArticleEditorPreview({
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
    const { value, isEmpty } = useClosedSnapshot(isOpen, () => ({
        value: [...editor.children] as Value,
        isEmpty: editor.api.isEmpty(),
    }));

    return (
        <EditorPreviewFrame
            isEmpty={isEmpty}
            icon={
                isEmpty ? (
                    <NotebookPen className="size-4" />
                ) : (
                    <SquarePen className="size-4" />
                )
            }
            buttonTitle={isEmpty ? buttonTitle : editButtonTitle}
            {...props}
        >
            <StaticViewer value={value} />
        </EditorPreviewFrame>
    );
}

export type PlateMarkdownEditorProps = {
    value?: string;
    children?: React.ReactNode;
    className?: string;
    placeholder?: string;
    modalDefaultOpen?: boolean;
    modalTitle?: string;
    modalDescription?: string;
    modalButtonTitle?: string;
    modalEditButtonTitle?: string;
    onValueChange?: (value: string) => void;
    editorId?: string;
};

export function PlateMarkdownEditor({
    value,
    children,
    className,
    placeholder = 'Напишіть повідомлення...',
    onValueChange,
    modalDefaultOpen,
    modalButtonTitle = 'Написати коментар',
    modalEditButtonTitle = 'Редагувати коментар',
    modalTitle = 'Коментар',
    modalDescription,
    editorId,
}: PlateMarkdownEditorProps) {
    const { editor, isMobile, isModalOpen, setIsModalOpen, handleChange } =
        usePlateMarkdownSetup({ value, modalDefaultOpen, editorId });

    useVisualViewportOffset(!!isModalOpen);

    if (isMobile === undefined) {
        return null;
    }

    return (
        <Plate
            editor={editor}
            onChange={handleChange}
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
                <PageSheet
                    open={isModalOpen}
                    defaultOpen={modalDefaultOpen}
                    onOpenChange={setIsModalOpen}
                >
                    <PageSheetTrigger asChild>
                        <EditorPreview
                            buttonTitle={modalButtonTitle}
                            editButtonTitle={modalEditButtonTitle}
                            editor={editor}
                            isOpen={isModalOpen}
                        />
                    </PageSheetTrigger>
                    <PageSheetContent className="top-(--visual-viewport-offset-top,0px)! bottom-auto! h-(--visual-viewport-height,100dvh)!">
                        <PageSheetHeader
                            title={modalTitle}
                            subtitle={modalDescription}
                        />

                        <EditorContainer
                            variant="drawer"
                            className={cn('-m-4 w-auto', className)}
                        >
                            <Editor
                                variant="drawer"
                                placeholder={placeholder}
                            />
                            <FixedToolbar className="rounded-none">
                                <FixedMarkdownToolbarButtons />
                            </FixedToolbar>
                            {children}
                        </EditorContainer>
                    </PageSheetContent>
                </PageSheet>
            )}

            {!isMobile && (
                <EditorContainer className={className}>
                    <FixedToolbar variant="top">
                        <FixedMarkdownToolbarButtons />
                    </FixedToolbar>
                    <Editor variant="comment" placeholder={placeholder} />
                    {children}
                </EditorContainer>
            )}
        </Plate>
    );
}

export type ArticlePlateEditorProps = {
    value?: Value;
    children?: React.ReactNode;
    className?: string;
    placeholder?: string;
    modalTitle?: string;
    modalDescription?: string;
    modalButtonTitle?: string;
    modalEditButtonTitle?: string;
    onValueChange?: (value: Value) => void;
    editorId?: string;
};

export function ArticlePlateEditor({
    value,
    children,
    className,
    placeholder = 'Напишіть зміст статті...',
    modalTitle = 'Зміст статті',
    modalDescription,
    modalButtonTitle = 'Написати статтю',
    modalEditButtonTitle = 'Редагувати статтю',
    onValueChange,
    editorId,
}: ArticlePlateEditorProps) {
    const editor = usePlateEditor({
        plugins: ArticleKit,
        value,
        nodeId: false,
        shouldNormalizeEditor: true,
    });

    // Enables drag-and-drop image upload (see image-group-kit insertData)
    useEffect(() => {
        editor.setOption(
            ImageGroupPlugin,
            'uploadImage',
            (file: File, options) => uploadAttachmentImage(file, options),
        );
    }, [editor]);

    useEditorApi(editor, editorId);

    const isMobile = useIsMobile();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useVisualViewportOffset(isModalOpen);

    if (isMobile === undefined) {
        return null;
    }

    return (
        <Plate
            editor={editor}
            onValueChange={
                onValueChange ? ({ value }) => onValueChange(value) : undefined
            }
        >
            {isMobile && (
                <PageSheet open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <PageSheetTrigger asChild>
                        <ArticleEditorPreview
                            buttonTitle={modalButtonTitle}
                            editButtonTitle={modalEditButtonTitle}
                            editor={editor}
                            isOpen={isModalOpen}
                        />
                    </PageSheetTrigger>
                    <PageSheetContent
                        className="top-(--visual-viewport-offset-top,0px)! bottom-auto! h-(--visual-viewport-height,100dvh)!"
                        onOpenAutoFocus={(e) => {
                            e.preventDefault();
                            editor.tf.focus();
                        }}
                    >
                        <PageSheetHeader
                            title={modalTitle}
                            subtitle={modalDescription}
                        />

                        <EditorContainer
                            variant="drawer"
                            className={cn(
                                '-m-4 w-auto [--plate-sticky-top:0px] [&>[role=toolbar]]:rounded-none',
                                className,
                            )}
                        >
                            <Editor
                                variant="drawer"
                                placeholder={placeholder}
                            />
                            {children}
                        </EditorContainer>
                    </PageSheetContent>
                </PageSheet>
            )}

            {!isMobile && (
                <EditorContainer className={className}>
                    <Editor variant="default" placeholder={placeholder} />
                    {children}
                </EditorContainer>
            )}
        </Plate>
    );
}

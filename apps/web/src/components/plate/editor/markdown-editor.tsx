import { MarkdownPlugin } from '@platejs/markdown';
import { MessageCircleMore, MessageCirclePlus } from 'lucide-react';
import { Plate, type PlateEditor } from 'platejs/react';

import { MDViewer } from '@/components/markdown';
import { Editor, EditorContainer } from '@/components/plate/ui/editor';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FixedMarkdownToolbarButtons } from '@/components/plate/ui/fixed-toolbar-buttons';
import {
    PageSheet,
    PageSheetContent,
    PageSheetHeader,
    PageSheetTrigger,
} from '@/components/ui/page-sheet';
import { useVisualViewportOffset } from '@/services/hooks/use-visual-viewport';
import { cn } from '@/utils/cn';

import EditorPreviewFrame from './editor-preview-frame';
import { useClosedSnapshot } from './use-closed-snapshot';
import { usePlateMarkdownSetup } from './use-plate-markdown-setup';

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
                    <PageSheetTrigger
                        render={
                            <EditorPreview
                                buttonTitle={modalButtonTitle}
                                editButtonTitle={modalEditButtonTitle}
                                editor={editor}
                                isOpen={isModalOpen}
                            />
                        }
                    />
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

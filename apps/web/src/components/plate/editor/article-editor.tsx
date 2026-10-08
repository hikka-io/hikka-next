import { useEffect, useState } from 'react';

import { NotebookPen, SquarePen } from 'lucide-react';
import type { Value } from 'platejs';
import { Plate, type PlateEditor, usePlateEditor } from 'platejs/react';

import { Editor, EditorContainer } from '@/components/plate/ui/editor';
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
import EditorPreviewFrame from './editor-preview-frame';
import { ImageGroupPlugin } from './plugins/image-group-plugin';
import { withoutTriggerPlugins } from './plugins/trigger-plugins';
import { StaticViewer } from './static-viewer';
import { uploadAttachmentImage } from './upload-image';
import { useClosedSnapshot } from './use-closed-snapshot';
import { useEditorApi } from './use-editor-api';

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
        plugins: withoutTriggerPlugins(ArticleKit),
        value,
        nodeId: false,
        shouldNormalizeEditor: true,
    });

    // Enables drag-and-drop image upload (see image-group-plugin insertData)
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
                    <PageSheetTrigger
                        render={
                            <ArticleEditorPreview
                                buttonTitle={modalButtonTitle}
                                editButtonTitle={modalEditButtonTitle}
                                editor={editor}
                                isOpen={isModalOpen}
                            />
                        }
                    />
                    <PageSheetContent
                        className="top-(--visual-viewport-offset-top,0px)! bottom-auto! h-(--visual-viewport-height,100dvh)!"
                        initialFocus={() => {
                            editor.tf.focus();
                            return false;
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

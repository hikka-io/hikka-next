import { useEffect, useRef } from 'react';

import { useHydrated } from '@tanstack/react-router';
import type { Value } from 'platejs';
import { Plate, type PlateEditor, usePlateEditor } from 'platejs/react';

import { Editor, EditorContainer } from '@/components/plate/ui/editor';
import { FixedArticleToolbarButtons } from '@/components/plate/ui/fixed-article-toolbar-buttons';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FloatingArticleToolbarButtons } from '@/components/plate/ui/floating-article-toolbar-buttons';
import { FloatingToolbar } from '@/components/plate/ui/floating-toolbar';
import { VideoDialogProvider } from '@/components/plate/ui/video-dialog';
import {
    useKeyboardInset,
    useVisualViewportOffset,
} from '@/services/hooks/use-visual-viewport';
import { cn } from '@/utils/cn';

import { ArticleKit } from './article-kit';
import { ARTICLE_BLOCK_PLACEHOLDER } from './plate-types';
import { ImageGroupPlugin } from './plugins/image-group-plugin';
import {
    isTouchDevice,
    withoutTriggerPlugins,
} from './plugins/trigger-plugins';
import { uploadAttachmentImage } from './upload-image';
import { revealSelection, useCaretReveal } from './use-caret-reveal';
import { useEditorApi } from './use-editor-api';

const TOUCH_PLACEHOLDER = 'Напишіть зміст статті...';

export type ArticlePlateEditorProps = {
    value?: Value;
    className?: string;
    onValueChange?: (value: Value) => void;
    /** Receives the editor once created; its children are the normalized starting value. */
    onReady?: (editor: PlateEditor) => void;
    editorId?: string;
};

export function ArticlePlateEditor({
    value,
    className,
    onValueChange,
    onReady,
    editorId,
}: ArticlePlateEditorProps) {
    const editor = usePlateEditor({
        plugins: withoutTriggerPlugins(ArticleKit),
        value,
        // Drag and drop tracks blocks by id; saves strip them (`getArticleDocument`).
        nodeId: true,
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

    useEffect(() => {
        onReady?.(editor);
    }, [editor, onReady]);

    useEditorApi(editor, editorId);

    const hydrated = useHydrated();
    const touch = hydrated && isTouchDevice();

    const toolbarRef = useRef<HTMLDivElement>(null);

    useKeyboardInset(touch);
    useVisualViewportOffset(touch);
    useCaretReveal(toolbarRef, touch);

    // The kit and toolbar depend on the pointer type, which the server cannot know.
    if (!hydrated) return null;

    return (
        <Plate
            editor={editor}
            onValueChange={
                onValueChange ? ({ value }) => onValueChange(value) : undefined
            }
        >
            <EditorContainer
                variant="inline"
                // Room for the docked toolbar; iOS also caps the scroll as if its keyboard bar were not there.
                className={cn(touch && 'pb-40', className)}
            >
                <Editor
                    variant="inline"
                    scrollSelectionIntoView={
                        touch
                            ? (editor, range) =>
                                  revealSelection(
                                      editor,
                                      range,
                                      toolbarRef.current,
                                  )
                            : undefined
                    }
                    placeholder={
                        touch ? TOUCH_PLACEHOLDER : ARTICLE_BLOCK_PLACEHOLDER
                    }
                />
                {touch ? (
                    <FixedToolbar ref={toolbarRef} variant="docked">
                        <FixedArticleToolbarButtons />
                    </FixedToolbar>
                ) : (
                    <FloatingToolbar>
                        <FloatingArticleToolbarButtons />
                    </FloatingToolbar>
                )}
            </EditorContainer>

            <VideoDialogProvider />
        </Plate>
    );
}

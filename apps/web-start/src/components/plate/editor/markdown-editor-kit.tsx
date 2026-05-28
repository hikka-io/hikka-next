'use client';

import { MarkdownPlugin } from '@platejs/markdown';
import { TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin, useEditorRef, usePlateEditor } from 'platejs/react';
import { useEffect, useState } from 'react';

import { useIsMobile } from '@/services/hooks/use-mobile';
import { usePreventUnsavedClose } from '@/services/hooks/use-prevent-unsaved-close';

import { AutoformatCommentKit } from './plugins/autoformat-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { EmojiKit } from './plugins/emoji-kit';
import { ExitBreakKit } from './plugins/exit-break-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-classic-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { SpoilerKit } from './plugins/spoiler-kit';

export const MarkdownEditorKit = [
    // Elements
    ...BasicBlocksKit,
    ...LinkKit,
    ...SpoilerKit,

    // Marks
    ...BasicMarksKit,

    // Editing
    ...EmojiKit,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    ...ExitBreakKit,
    ...AutoformatCommentKit,

    // Block Style
    ...ListKit,

    // Parsers
    ...MarkdownKit,
];

export const useMarkdownEditor = () => useEditorRef();

interface UsePlateMarkdownSetupOptions {
    value?: string;
    modalDefaultOpen?: boolean;
}

export function usePlateMarkdownSetup(options: UsePlateMarkdownSetupOptions) {
    const editor = usePlateEditor({
        plugins: MarkdownEditorKit,
        value: (editor) =>
            editor.getApi(MarkdownPlugin).markdown.deserialize(options.value ?? ''),
    });

    const [isModalOpen, setIsModalOpen] = useState(
        options.modalDefaultOpen ?? false,
    );
    const [hasUnsavedContent, setHasUnsavedContent] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        setHasUnsavedContent(!editor.api.isEmpty());
    }, [editor]);

    usePreventUnsavedClose(hasUnsavedContent);

    const handleChange = () => {
        setHasUnsavedContent(!editor.api.isEmpty());
    };

    return {
        editor,
        isMobile,
        isModalOpen,
        setIsModalOpen,
        hasUnsavedContent,
        handleChange,
    };
}

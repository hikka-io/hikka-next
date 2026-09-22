import { useEffect, useState } from 'react';

import { MarkdownPlugin } from '@platejs/markdown';
import { TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin, useEditorRef, usePlateEditor } from 'platejs/react';

import { useIsMobile } from '@/services/hooks/use-mobile';
import { usePreventUnsavedClose } from '@/services/hooks/use-prevent-unsaved-close';

import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { ContentSearchKit } from './plugins/content-search-kit';
import { EmojiKit } from './plugins/emoji-kit';
import { ExitBreakKit } from './plugins/exit-break-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-classic-kit';
import { createMarkdownKit } from './plugins/markdown-kit';
import { SpoilerKit } from './plugins/spoiler-kit';
import { StrikethroughKit } from './plugins/strikethrough-kit';
import { TextSubstitutionsKit } from './plugins/text-substitutions-kit';
import { withoutTriggerPlugins } from './plugins/trigger-plugins';
import { UserSearchKit } from './plugins/user-search-kit';
import { useEditorApi } from './use-editor-api';

export const MarkdownEditorKit = [
    // Elements
    ...BasicBlocksKit,
    ...LinkKit,
    ...SpoilerKit,

    // Marks
    ...BasicMarksKit,
    ...StrikethroughKit,

    // Editing
    ...EmojiKit,
    ...UserSearchKit,
    ...ContentSearchKit,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    ...ExitBreakKit,
    ...TextSubstitutionsKit,

    // Block Style
    ...ListKit,

    // Parsers
    ...createMarkdownKit({ mentions: true }),
];

export const useMarkdownEditor = () => useEditorRef();

interface UsePlateMarkdownSetupOptions {
    value?: string;
    modalDefaultOpen?: boolean;
    editorId?: string;
}

export function usePlateMarkdownSetup(options: UsePlateMarkdownSetupOptions) {
    const editor = usePlateEditor({
        plugins: withoutTriggerPlugins(MarkdownEditorKit),
        value: (editor) =>
            editor
                .getApi(MarkdownPlugin)
                .markdown.deserialize(options.value ?? ''),
    });

    useEditorApi(editor, options.editorId);

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

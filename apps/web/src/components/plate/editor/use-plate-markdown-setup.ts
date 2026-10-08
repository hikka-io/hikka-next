import { useEffect, useState } from 'react';

import { MarkdownPlugin } from '@platejs/markdown';
import { usePlateEditor } from 'platejs/react';

import { useIsMobile } from '@/services/hooks/use-mobile';
import { usePreventUnsavedClose } from '@/services/hooks/use-prevent-unsaved-close';

import { MarkdownEditorKit } from './markdown-editor-kit';
import { withoutTriggerPlugins } from './plugins/trigger-plugins';
import { useEditorApi } from './use-editor-api';

type UsePlateMarkdownSetupOptions = {
    value?: string;
    modalDefaultOpen?: boolean;
    editorId?: string;
};

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

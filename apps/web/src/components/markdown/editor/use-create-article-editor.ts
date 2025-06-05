'use client';

import { Value } from '@udecode/plate';
import { usePlateEditor } from '@udecode/plate/react';

import { editorComponents, viewerComponents } from './components';
import { articlePlugins } from './plugins';
import { ArticleToolbarPlugin } from './plugins/article-toolbar-plugin';
import { deserializeMd } from './plugins/markdown-plugin/deserialize-md';

interface CreateEditorOptions {
    initialValue?: string | Value;
    disableToolbar?: boolean;
    readOnly?: boolean;
}

export const useCreateArticleEditor = ({
    initialValue,
    disableToolbar,
    readOnly,
}: CreateEditorOptions) => {
    return usePlateEditor(
        {
            override: {
                components: {
                    ...editorComponents,
                    ...(readOnly ? viewerComponents : {}),
                },
            },
            plugins: [
                ...articlePlugins,
                ...(disableToolbar ? [] : [ArticleToolbarPlugin]),
            ],
            value: (editor) =>
                typeof initialValue === 'string'
                    ? deserializeMd({ editor, data: initialValue })
                    : initialValue,
        },
        [],
    );
};

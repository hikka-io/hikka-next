'use client';

import { Value } from '@udecode/plate-common';
import { usePlateEditor } from '@udecode/plate-common/react';

import { editorComponents, viewerComponents } from './components';
import { editorPlugins } from './plugins';
import { FixedToolbarPlugin } from './plugins/fixed-toolbar-plugin';
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
                ...editorPlugins,
                ...(disableToolbar ? [] : [FixedToolbarPlugin]),
            ],
            value: (editor) =>
                typeof initialValue === 'string'
                    ? deserializeMd({ editor, data: initialValue })
                    : initialValue,
        },
        [],
    );
};

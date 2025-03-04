'use client';

import { Value } from '@udecode/plate';
import { usePlateEditor } from '@udecode/plate/react';

import { editorComponents } from './components';
import { basicPlugins } from './plugins';
import { BasicToolbarPlugin } from './plugins/basic-toolbar-plugin';
import { deserializeMd } from './plugins/markdown-plugin/deserialize-md';

interface CreateEditorOptions {
    initialValue?: string | Value;
    disableToolbar?: boolean;
}

export const useCreateEditor = ({
    initialValue,
    disableToolbar,
}: CreateEditorOptions) => {
    return usePlateEditor(
        {
            override: {
                components: {
                    ...editorComponents,
                },
            },
            plugins: [
                ...basicPlugins,
                ...(disableToolbar ? [] : [BasicToolbarPlugin]),
            ],
            value: (editor) =>
                typeof initialValue === 'string'
                    ? deserializeMd({ editor, data: initialValue })
                    : initialValue,
        },
        [],
    );
};

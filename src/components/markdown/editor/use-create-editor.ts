'use client';

import { withProps } from '@udecode/cn';
import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react';
import { Value } from '@udecode/plate-common';
import {
    ParagraphPlugin,
    PlateElement,
    PlateLeaf,
    usePlateEditor,
} from '@udecode/plate-common/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
    BulletedListPlugin,
    ListItemPlugin,
    NumberedListPlugin,
} from '@udecode/plate-list/react';

import { EmojiInputElement } from '@/components/markdown/editor/plate-ui/emoji-input-element';
import { LinkElement } from '@/components/markdown/editor/plate-ui/link-element';
import { ListElement } from '@/components/markdown/editor/plate-ui/list-element';
import { SpoilerElement } from '@/components/markdown/editor/plate-ui/spoiler-element';

import { editorPlugins } from './plugins';
import { FixedToolbarPlugin } from './plugins/fixed-toolbar-plugin';
import { deserializeMd } from './plugins/markdown-plugin/deserialize-md';
import { SpoilerPlugin } from './plugins/spoiler-plugin/spoiler-plugin';

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
                    [EmojiInputPlugin.key]: EmojiInputElement,
                    [BulletedListPlugin.key]: withProps(ListElement, {
                        variant: 'ul',
                    }),
                    [ListItemPlugin.key]: withProps(PlateElement, { as: 'li' }),
                    [NumberedListPlugin.key]: withProps(ListElement, {
                        variant: 'ol',
                    }),
                    [LinkPlugin.key]: LinkElement,
                    [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
                    [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
                    [ParagraphPlugin.key]: withProps(PlateElement, {
                        as: 'p',
                        className: 'mb-4',
                    }),
                    blockquote: withProps(PlateElement, {
                        as: 'blockquote',
                        className: 'mb-4 border-l-2 pl-6 italic border-border',
                    }),
                    [SpoilerPlugin.key]: SpoilerElement,
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

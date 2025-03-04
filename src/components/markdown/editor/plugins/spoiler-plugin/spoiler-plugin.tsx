'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { SpoilerElement } from '@/components/markdown/editor/plate-ui/spoiler-element';

import { withSpoiler } from './with-spoiler';

export const ELEMENT_SPOILER = 'spoiler';

export const SpoilerPlugin = createPlatePlugin({
    key: ELEMENT_SPOILER,
    node: {
        isElement: true,
        component: SpoilerElement,
    },
    shortcuts: {
        toggleSpoiler: {
            handler: ({ editor }) => {
                editor.tf.toggleBlock(ELEMENT_SPOILER);
            },
            preventDefault: true,
            keys: ['mod+opt+s', 'mod+shift+s'],
        },
    },
    parsers: {
        html: {
            deserializer: {
                rules: [
                    {
                        validNodeName: 'DIV',
                        validClassName: 'spoiler',
                    },
                ],
            },
        },
    },
    extendEditor: withSpoiler,
});

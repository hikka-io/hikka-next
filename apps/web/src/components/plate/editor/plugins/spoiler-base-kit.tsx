import { createSlatePlugin } from 'platejs';

import { SpoilerInlineElementStatic } from '@/components/plate/ui/spoiler-inline-node-static';
import { SpoilerElementStatic } from '@/components/plate/ui/spoiler-node-static';

import { ELEMENT_SPOILER, ELEMENT_SPOILER_INLINE } from '../plate-types';

export const BaseSpoilerPlugin = createSlatePlugin({
    key: ELEMENT_SPOILER,
    node: {
        isElement: true,
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
                parse: () => ({
                    type: ELEMENT_SPOILER,
                }),
            },
        },
    },
}).extendTransforms(({ editor, type }) => ({
    toggle: () => {
        editor.tf.toggleBlock(type, { wrap: true });
    },
}));

export const BaseSpoilerInlinePlugin = createSlatePlugin({
    key: ELEMENT_SPOILER_INLINE,
    node: {
        isElement: true,
        isInline: true,
    },
});

export const BaseSpoilerKit = [
    BaseSpoilerPlugin.withComponent(SpoilerElementStatic),
    BaseSpoilerInlinePlugin.withComponent(SpoilerInlineElementStatic),
];

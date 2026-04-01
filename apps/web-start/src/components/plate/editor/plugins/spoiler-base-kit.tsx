import { createSlatePlugin } from 'platejs';

import { SpoilerElementStatic } from '@/components/plate/ui/spoiler-node-static';

export const ELEMENT_SPOILER = 'spoiler';

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
        editor.tf.toggleBlock(type);
    },
}));

export const BaseSpoilerKit = [
    BaseSpoilerPlugin.withComponent(SpoilerElementStatic),
];

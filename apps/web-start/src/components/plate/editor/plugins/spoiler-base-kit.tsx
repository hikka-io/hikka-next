import { createSlatePlugin } from 'platejs';

import { SpoilerElementStatic } from '@/components/plate/ui/spoiler-node-static';

export const ELEMENT_SPOILER = 'spoiler';

export const BaseSpoilerPlugin = createSlatePlugin({
    key: ELEMENT_SPOILER,
    node: {
        isElement: true,
    },
});

export const BaseSpoilerKit = [
    BaseSpoilerPlugin.withComponent(SpoilerElementStatic),
];

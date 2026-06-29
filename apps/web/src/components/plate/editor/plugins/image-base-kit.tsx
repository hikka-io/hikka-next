import { createSlatePlugin } from 'platejs';

import { ImageElementStatic } from '@/components/plate/ui/image-node-static';

export const ELEMENT_IMAGE = 'image';

export const BaseImagePlugin = createSlatePlugin({
    key: ELEMENT_IMAGE,
    node: {
        isElement: true,
        isVoid: true,
    },
});

export const BaseImageKit = [BaseImagePlugin.withComponent(ImageElementStatic)];

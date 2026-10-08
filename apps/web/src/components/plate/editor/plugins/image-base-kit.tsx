import { createSlatePlugin } from 'platejs';

import { ImageElementStatic } from '@/components/plate/ui/image-node-static';

import { ELEMENT_IMAGE } from '../plate-types';

export const BaseImagePlugin = createSlatePlugin({
    key: ELEMENT_IMAGE,
    node: {
        isElement: true,
        isVoid: true,
    },
});

export const BaseImageKit = [BaseImagePlugin.withComponent(ImageElementStatic)];

import { createSlatePlugin } from 'platejs';

import { ImageGroupElementStatic } from '@/components/plate/ui/image-group-node-static';

import { BaseImageKit } from './image-base-kit';

export const ELEMENT_IMAGE_GROUP = 'image_group';

export const BaseImageGroupPlugin = createSlatePlugin({
    key: ELEMENT_IMAGE_GROUP,
    node: {
        isElement: true,
    },
    plugins: BaseImageKit,
});

export const BaseImageGroupKit = [
    ...BaseImageKit,
    BaseImageGroupPlugin.withComponent(ImageGroupElementStatic),
];

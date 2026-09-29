import { createSlatePlugin } from 'platejs';

import { ImageGroupElementStatic } from '@/components/plate/ui/image-group-node-static';

import { ELEMENT_IMAGE_GROUP } from '../plate-types';
import { BaseImageKit } from './image-base-kit';

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

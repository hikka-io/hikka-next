'use client';

import { PluginConfig, TElement } from '@udecode/plate-common';
import {
    createPlatePlugin,
    createTPlatePlugin,
} from '@udecode/plate-common/react';

import { withImageGroup } from './with-image-group';

export const ELEMENT_IMAGE = 'image';
export const ELEMENT_IMAGE_GROUP = 'image_group';

export type ImageItemElement = {
    url: string;
} & TElement;

export type ImageConfig = PluginConfig<'image', { url: string }>;

export const ImagePlugin = createTPlatePlugin<ImageConfig>({
    key: ELEMENT_IMAGE,
    options: {
        url: '',
    },
    node: {
        isElement: true,
        isVoid: true,
    },
});

export const ImageGroupPlugin = createPlatePlugin({
    key: ELEMENT_IMAGE_GROUP,
    node: {
        isElement: true,
    },
    plugins: [ImagePlugin],
    extendEditor: withImageGroup,
});

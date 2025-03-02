'use client';

import { PluginConfig, TElement } from '@udecode/plate-common';
import { createTPlatePlugin } from '@udecode/plate-common/react';

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

export type ImageGroupConfig = PluginConfig<
    'image_group',
    {
        uploadImage?: (file: File) => Promise<{ url: string } | undefined>;
    }
>;

export const ImageGroupPlugin = createTPlatePlugin<ImageGroupConfig>({
    key: ELEMENT_IMAGE_GROUP,
    node: {
        isElement: true,
    },
    options: {
        uploadImage: undefined,
    },
    plugins: [ImagePlugin],
    extendEditor: withImageGroup,
});

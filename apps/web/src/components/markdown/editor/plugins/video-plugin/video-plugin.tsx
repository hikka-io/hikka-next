'use client';

import { PluginConfig, TElement } from '@udecode/plate';
import { createTPlatePlugin } from '@udecode/plate/react';

export const ELEMENT_VIDEO = 'video';

export type VideoElement = {
    url: string;
} & TElement;

export type VideoConfig = PluginConfig<'video', { url: string }>;

export const VideoPlugin = createTPlatePlugin<VideoConfig>({
    key: ELEMENT_VIDEO,
    options: {
        url: '',
    },
    node: {
        isElement: true,
        isVoid: true,
    },
});

'use client';

import { createPlatePlugin } from 'platejs/react';

import { VideoElement } from '@/components/plate/ui/video-node';

export const ELEMENT_VIDEO = 'video';

export interface VideoElementProps {
    url: string;
    children: Array<{ text: string }>;
    type: typeof ELEMENT_VIDEO;
}

export const VideoPlugin = createPlatePlugin({
    key: ELEMENT_VIDEO,
    node: {
        isElement: true,
        isVoid: true,
    },
    parsers: {
        html: {
            deserializer: {
                rules: [
                    {
                        validNodeName: 'VIDEO',
                    },
                    {
                        validNodeName: 'IFRAME',
                        validAttribute: 'src',
                    },
                ],
                parse: ({ element }) => {
                    const src = element.getAttribute('src');
                    const url = src || element.getAttribute('data-url') || '';

                    return {
                        type: ELEMENT_VIDEO,
                        url,
                        children: [{ text: '' }],
                    };
                },
            },
        },
    },
}).extendEditorTransforms(({ editor }) => ({
    insert: {
        video: (options: { url: string; at?: any }) => {
            const { url, at } = options;

            const videoNode = {
                type: ELEMENT_VIDEO,
                url,
                children: [{ text: '' }],
            };

            editor.tf.insertNodes(videoNode, { at });
        },
    },
}));

export const VideoKit = [VideoPlugin.withComponent(VideoElement)];

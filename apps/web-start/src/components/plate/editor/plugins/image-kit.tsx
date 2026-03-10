'use client';

import { createPlatePlugin } from 'platejs/react';

import { ImageElement } from '@/components/plate/ui/image-node';

export const ELEMENT_IMAGE = 'image';

export interface ImageElementProps {
    url: string;
    children: Array<{ text: string }>;
    type: typeof ELEMENT_IMAGE;
}

export const ImagePlugin = createPlatePlugin({
    key: ELEMENT_IMAGE,
    node: {
        isElement: true,
        isVoid: true,
    },
    parsers: {
        html: {
            deserializer: {
                rules: [
                    {
                        validNodeName: 'IMG',
                    },
                ],
                parse: ({ element }) => {
                    const src = element.getAttribute('src');
                    const url = src || '';

                    return {
                        type: ELEMENT_IMAGE,
                        url,
                        children: [{ text: '' }],
                    };
                },
            },
        },
    },
}).extendEditorTransforms(({ editor }) => ({
    insert: {
        image: (options: { url: string; at?: any }) => {
            const { url, at } = options;

            const imageNode = {
                type: ELEMENT_IMAGE,
                url,
                children: [{ text: '' }],
            };

            editor.tf.insertNodes(imageNode, { at });
        },
    },
}));

export const ImageKit = [ImagePlugin.withComponent(ImageElement)];

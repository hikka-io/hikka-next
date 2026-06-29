import type { Path, TElement } from 'platejs';
import { createPlatePlugin } from 'platejs/react';

import { ImageElement } from '@/components/plate/ui/image-node';

export const ELEMENT_IMAGE = 'image';

export interface TImageElement extends TElement {
    type: typeof ELEMENT_IMAGE;
    url: string;
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
        image: (options: { url: string; at?: Path }) => {
            const { url, at } = options;

            const imageNode: TImageElement = {
                type: ELEMENT_IMAGE,
                url,
                children: [{ text: '' }],
            };

            editor.tf.insertNodes(imageNode, { at });
        },
    },
}));

export const ImageKit = [ImagePlugin.withComponent(ImageElement)];

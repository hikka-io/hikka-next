import { TElement } from '@udecode/plate';
import { PlateEditor } from '@udecode/plate/react';

import {
    ImageGroupPlugin,
    ImageItemElement,
    ImagePlugin,
} from '../image-group-plugin';

const MAX_IMAGE_COUNT = 4;

export const insertImages = (
    editor: PlateEditor,
    urls: string[],
    element?: TElement,
) => {
    const text = { text: '' };
    const maxImages = element
        ? MAX_IMAGE_COUNT - element.children.length
        : MAX_IMAGE_COUNT;

    const images: ImageItemElement[] = urls.slice(0, maxImages).map((url) => ({
        children: [text],
        type: editor.getType(ImagePlugin),
        url: url,
    }));

    if (element) {
        const path = editor.api.findPath(element);

        if (!path) return;

        editor.tf.insertNodes(images, {
            at: [...path, element.children.length],
        });

        return;
    }

    editor.tf.insertNode({
        type: editor.getType(ImageGroupPlugin),
        children: images,
    });
};

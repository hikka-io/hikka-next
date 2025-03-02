import { TElement } from '@udecode/plate-common';
import { PlateEditor } from '@udecode/plate-common/react';

import { ImageGroupPlugin } from '../image-group-plugin';
import { insertImages } from './insert-images';

export const insertImageGroupFromFiles = async (
    editor: PlateEditor,
    files: FileList | File[],
    element?: TElement,
) => {
    const uploadedImages: string[] = [];

    for (const file of files) {
        const [mime] = file.type.split('/');

        if (mime === 'image') {
            const uploadImage = editor.getOptions(ImageGroupPlugin).uploadImage;

            const uploaded = uploadImage && (await uploadImage(file));

            if (!uploaded) {
                continue;
            }

            uploadedImages.push(uploaded.url);
        }
    }

    insertImages(editor, uploadedImages, element);
};

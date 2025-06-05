import { TElement } from '@udecode/plate';
import { PlateEditor } from '@udecode/plate/react';
import { Jimp, JimpMime } from 'jimp';

import { ImageGroupPlugin } from '../image-group-plugin';
import { insertImages } from './insert-images';

const convertImage = async ({ file }: { file: File }) => {
    const image = await Jimp.read(await file.arrayBuffer());
    const convertedBuffer = await image.getBuffer(JimpMime.jpeg, {
        quality: 80,
    });

    const uint8Array = new Uint8Array(convertedBuffer);

    return new File([uint8Array], file.name, { type: JimpMime.jpeg });
};

type InsertImageGroupFromFilesOptions = {
    files: FileList | File[];
    element?: TElement;
    editor: PlateEditor;
    uploadImage?: (file: File) => Promise<{ url: string } | undefined>;
};

export const insertImageGroupFromFiles = async ({
    files,
    element,
    editor,
    uploadImage: customUploadImage,
}: InsertImageGroupFromFilesOptions) => {
    const uploadedImages: string[] = [];

    for (let file of files) {
        const [mime, format] = file.type.split('/');

        if (mime === 'image') {
            if (format === 'png') {
                file = await convertImage({ file });
            }

            const uploadImage =
                customUploadImage ??
                editor.getOptions(ImageGroupPlugin).uploadImage;

            const uploaded = uploadImage && (await uploadImage(file));

            if (!uploaded) {
                continue;
            }

            uploadedImages.push(uploaded.url);
        }
    }

    insertImages(editor, uploadedImages, element);
};

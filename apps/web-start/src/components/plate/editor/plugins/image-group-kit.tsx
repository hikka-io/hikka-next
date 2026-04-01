'use client';

import { ElementApi } from 'platejs';
import { createPlatePlugin } from 'platejs/react';

import { ImageGroupElement } from '@/components/plate/ui/image-group-node';

import { ELEMENT_IMAGE, ImageKit, ImagePlugin } from './image-kit';

export const ELEMENT_IMAGE_GROUP = 'image_group';

export interface ImageGroupElementProps {
    uploadImage?: (file: File) => Promise<{ url: string } | undefined>;
    children: Array<any>;
    type: typeof ELEMENT_IMAGE_GROUP;
}

export const ImageGroupPlugin = createPlatePlugin({
    key: ELEMENT_IMAGE_GROUP,
    node: {
        isElement: true,
    },
    options: {
        uploadImage: undefined as
            | ((file: File) => Promise<{ url: string } | undefined>)
            | undefined,
    },
    plugins: [ImagePlugin],
})
    .overrideEditor(({ editor, tf: { normalizeNode, insertData } }) => {
        return {
            transforms: {
                normalizeNode([node, path]) {
                    if (
                        ElementApi.isElement(node) &&
                        node.type === ELEMENT_IMAGE_GROUP
                    ) {
                        const { children } = node;

                        // Remove image group if it only contains a single empty text node
                        if (
                            children.length === 1 &&
                            editor.api.isText(children[0]) &&
                            children[0].text === ''
                        ) {
                            editor.tf.removeNodes({ at: path });
                            return;
                        }
                    }

                    normalizeNode([node, path]);
                },

                insertData(data: DataTransfer) {
                    const text = data.getData('text/plain');
                    const { files } = data;

                    if (!text && files && files.length > 0) {
                        // Handle file drop - insert image group
                        editor
                            .getTransforms(ImageGroupPlugin)
                            .insert.imageGroupFromFiles({ files });
                    } else {
                        return insertData(data);
                    }
                },
            },
        };
    })
    .extendEditorTransforms(({ editor }) => ({
        insert: {
            imageGroupFromFiles: async (options: {
                files: FileList | File[];
                element?: any;
                uploadImage?: (
                    file: File,
                ) => Promise<{ url: string } | undefined>;
            }) => {
                const {
                    files,
                    element,
                    uploadImage: customUploadImage,
                } = options;
                const uploadedImages: string[] = [];

                for (let file of files) {
                    const [mime, format] = file.type.split('/');

                    if (mime === 'image') {
                        // Convert PNG to JPEG if needed (simplified version)
                        let processedFile = file;
                        if (format === 'png') {
                            // In a real implementation, you might want to convert PNG to JPEG
                            // For now, we'll just use the original file
                            processedFile = file;
                        }

                        const uploadImage =
                            customUploadImage ??
                            editor.getOptions(ImageGroupPlugin).uploadImage;
                        const uploaded =
                            uploadImage && (await uploadImage(processedFile));

                        if (!uploaded) {
                            continue;
                        }

                        uploadedImages.push(uploaded.url);
                    }
                }

                editor
                    .getTransforms(ImageGroupPlugin)
                    .insert.images({ urls: uploadedImages, element });
            },

            images: (options: { urls: string[]; element?: any }) => {
                const { urls, element } = options;
                const text = { text: '' };
                const MAX_IMAGE_COUNT = 4;

                const maxImages = element
                    ? MAX_IMAGE_COUNT - element.children.length
                    : MAX_IMAGE_COUNT;

                const images = urls.slice(0, maxImages).map((url) => ({
                    children: [text],
                    type: ELEMENT_IMAGE,
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

                editor.tf.insertNodes({
                    type: ELEMENT_IMAGE_GROUP,
                    children: images,
                });
            },
        },
    }));

export const ImageGroupKit = [
    ...ImageKit,
    ImageGroupPlugin.withComponent(ImageGroupElement),
];

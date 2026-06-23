'use client';

import {
    ElementApi,
    type Path,
    type PluginConfig,
    type TElement,
} from 'platejs';
import { createTPlatePlugin } from 'platejs/react';
import { toast } from 'sonner';

import { ImageGroupElement } from '@/components/plate/ui/image-group-node';

import {
    ELEMENT_IMAGE,
    ImageKit,
    ImagePlugin,
    type TImageElement,
} from './image-kit';

export const ELEMENT_IMAGE_GROUP = 'image_group';

export const MAX_IMAGE_COUNT = 4;

export type UploadImageFn = (
    file: File,
) => Promise<{ url: string } | undefined>;

export interface TImageGroupElement extends TElement {
    type: typeof ELEMENT_IMAGE_GROUP;
    children: TImageElement[];
}

type ImageGroupConfig = PluginConfig<
    'image_group',
    { uploadImage?: UploadImageFn }
>;

export const ImageGroupPlugin = createTPlatePlugin<ImageGroupConfig>({
    key: ELEMENT_IMAGE_GROUP,
    node: {
        isElement: true,
    },
    options: { uploadImage: undefined },
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
                    const { uploadImage } = editor.getOptions(ImageGroupPlugin);

                    if (!text && files && files.length > 0 && uploadImage) {
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
                element?: TImageGroupElement;
                uploadImage?: UploadImageFn;
            }) => {
                const { files, element } = options;
                const uploadImage =
                    options.uploadImage ??
                    editor.getOptions(ImageGroupPlugin).uploadImage;

                if (!uploadImage) return;

                // Only upload what still fits into the group
                const capacity = element
                    ? MAX_IMAGE_COUNT - element.children.length
                    : MAX_IMAGE_COUNT;

                const imageFiles = Array.from(files)
                    .filter((file) => file.type.startsWith('image/'))
                    .slice(0, Math.max(capacity, 0));

                if (imageFiles.length === 0) return;

                const results = await Promise.allSettled(
                    imageFiles.map((file) => uploadImage(file)),
                );

                const urls = results
                    .map((result) =>
                        result.status === 'fulfilled'
                            ? result.value?.url
                            : undefined,
                    )
                    .filter((url): url is string => Boolean(url));

                const failedCount = imageFiles.length - urls.length;
                if (failedCount > 0) {
                    toast.error(
                        failedCount === 1
                            ? 'Не вдалося завантажити зображення'
                            : `Не вдалося завантажити зображення (${failedCount})`,
                    );
                }

                if (urls.length === 0) return;

                editor
                    .getTransforms(ImageGroupPlugin)
                    .insert.images({ urls, element });
            },

            images: (options: {
                urls: string[];
                element?: TImageGroupElement;
            }) => {
                const { urls, element } = options;
                const text = { text: '' };

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
                        at: [...path, element.children.length] as Path,
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

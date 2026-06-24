import { ElementApi, type PluginConfig, type TElement } from 'platejs';
import { createTPlatePlugin } from 'platejs/react';
import { toast } from 'sonner';

import { classifyAttachmentType } from '@hikka/client';

import { ImageGroupElement } from '@/components/plate/ui/image-group-node';

import { UPLOAD_VALIDATION_MESSAGES } from '../upload-image';
import { getUpload } from '../upload-store';
import { ImageKit, ImagePlugin, type TImageElement } from './image-kit';
import {
    ImagePlaceholderKit,
    ImagePlaceholderPlugin,
} from './image-placeholder-kit';

export const ELEMENT_IMAGE_GROUP = 'image_group';

export const MAX_IMAGE_COUNT = 4;

export type UploadImageFn = (
    file: File,
    options?: {
        onProgress?: (percent: number) => void;
        signal?: AbortSignal;
    },
) => Promise<{ url: string }>;

export interface TImageGroupElement extends TElement {
    type: typeof ELEMENT_IMAGE_GROUP;
    children: (TImageElement | TElement)[];
}

type ImageGroupConfig = PluginConfig<
    'image_group',
    { uploadImage?: UploadImageFn }
>;

export const ImageGroupPlugin = createTPlatePlugin<ImageGroupConfig>({
    key: ELEMENT_IMAGE_GROUP,
    node: { isElement: true },
    options: { uploadImage: undefined },
    plugins: [ImagePlugin, ImagePlaceholderPlugin],
})
    .overrideEditor(({ editor, tf: { normalizeNode, insertData } }) => ({
        transforms: {
            normalizeNode([node, path]) {
                if (
                    ElementApi.isElement(node) &&
                    node.type === ELEMENT_IMAGE_GROUP
                ) {
                    const { children } = node;
                    // Drop a group that has collapsed to a single empty text node.
                    if (
                        children.length === 1 &&
                        editor.api.isText(children[0]) &&
                        (children[0] as { text: string }).text === ''
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
                    // Append to the group under the cursor if there is one with
                    // capacity, otherwise a fresh group is created downstream.
                    const groupEntry = editor.api.node<TImageGroupElement>({
                        match: (n) =>
                            (n as TElement).type === ELEMENT_IMAGE_GROUP,
                        mode: 'lowest',
                    });
                    const group =
                        groupEntry &&
                        groupEntry[0].children.length < MAX_IMAGE_COUNT
                            ? groupEntry[0]
                            : undefined;

                    editor
                        .getTransforms(ImageGroupPlugin)
                        .imageGroup.upload({ files: Array.from(files), group });
                } else {
                    insertData(data);
                }
            },
        },
    }))
    .extendEditorTransforms(({ editor }) => {
        const runUpload = async (id: string, file: File) => {
            const uploadImage = editor.getOptions(ImageGroupPlugin).uploadImage;
            if (!uploadImage) return;

            const entry = getUpload(editor, id);

            try {
                const { url } = await uploadImage(file, {
                    onProgress: (progress) =>
                        editor
                            .getTransforms(ImagePlaceholderPlugin)
                            .placeholder.update({ id, patch: { progress } }),
                    signal: entry?.abort.signal,
                });
                editor
                    .getTransforms(ImagePlaceholderPlugin)
                    .placeholder.resolve({ id, url });
            } catch (error) {
                if (entry?.abort.signal.aborted) return; // user cancelled

                const message =
                    (error as Error)?.message ?? 'Помилка завантаження';

                editor
                    .getTransforms(ImagePlaceholderPlugin)
                    .placeholder.update({
                        id,
                        patch: {
                            status: 'error',
                            progress: 0,
                            error: {
                                code: (error as { code?: string })?.code,
                                message,
                            },
                        },
                    });

                // Surface the backend reason as a toast too. Dedupe by message
                // so a failed batch of identical errors shows a single toast.
                toast.error(message, { id: `upload-error:${message}` });
            }
        };

        return {
            imageGroup: {
                /** Validate, insert placeholders, and upload a batch of files. */
                upload: async (options: {
                    files: File[];
                    group?: TImageGroupElement;
                }) => {
                    const { files, group } = options;
                    const existing = group ? group.children.length : 0;
                    const capacity = Math.max(MAX_IMAGE_COUNT - existing, 0);

                    if (files.length > capacity) {
                        toast.error(`Максимум ${MAX_IMAGE_COUNT} зображення.`);
                    }

                    // Pre-insert type gate (size is checked later, post-convert).
                    const accepted = files.slice(0, capacity).filter((file) => {
                        if (classifyAttachmentType(file.type) === 'reject') {
                            toast.error(
                                UPLOAD_VALIDATION_MESSAGES['unsupported-type'],
                            );
                            return false;
                        }
                        return true;
                    });

                    if (accepted.length === 0) return;

                    const ids = editor
                        .getTransforms(ImagePlaceholderPlugin)
                        .placeholder.insert({ files: accepted, group });

                    await Promise.all(
                        accepted.map((file, index) =>
                            runUpload(ids[index], file),
                        ),
                    );
                },

                /** Retry a single errored placeholder using its stored file. */
                retry: async (options: { id: string }) => {
                    const stored = getUpload(editor, options.id);
                    if (!stored) {
                        // File is gone (e.g. reloaded doc); just clear the node.
                        editor
                            .getTransforms(ImagePlaceholderPlugin)
                            .placeholder.remove({ id: options.id });
                        return;
                    }
                    // Fresh AbortController for the retried attempt.
                    stored.abort = new AbortController();
                    editor
                        .getTransforms(ImagePlaceholderPlugin)
                        .placeholder.update({
                            id: options.id,
                            patch: {
                                status: 'uploading',
                                progress: 0,
                                error: undefined,
                            },
                        });
                    await runUpload(options.id, stored.file);
                },
            },
        };
    });

export const ImageGroupKit = [
    ...ImageKit,
    ...ImagePlaceholderKit,
    ImageGroupPlugin.withComponent(ImageGroupElement),
];

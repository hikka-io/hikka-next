'use client';

import type { Path, TElement } from 'platejs';
import { createPlatePlugin } from 'platejs/react';

import { ImagePlaceholderElement } from '@/components/plate/ui/image-placeholder-node';

import { deleteUpload, getUpload, setUpload } from '../upload-store';
import { ELEMENT_IMAGE, type TImageElement } from './image-kit';

// Keep in sync with the literal in utils/plate/strip-upload-placeholders.ts
export const ELEMENT_IMAGE_PLACEHOLDER = 'image_placeholder';

export type ImagePlaceholderStatus = 'uploading' | 'error';

export interface TImagePlaceholderElement extends TElement {
    type: typeof ELEMENT_IMAGE_PLACEHOLDER;
    id: string;
    name: string;
    previewUrl: string;
    status: ImagePlaceholderStatus;
    progress: number;
    error?: { code?: string; message: string };
}

function createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `ph_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
}

export const ImagePlaceholderPlugin = createPlatePlugin({
    key: ELEMENT_IMAGE_PLACEHOLDER,
    node: {
        isElement: true,
        isVoid: true,
    },
})
    .extendEditorTransforms(({ editor }) => {
        const findEntry = (id: string) =>
            [
                ...editor.api.nodes<TImagePlaceholderElement>({
                    at: [],
                    match: (n) =>
                        (n as TElement).type === ELEMENT_IMAGE_PLACEHOLDER &&
                        (n as TImagePlaceholderElement).id === id,
                }),
            ][0];

        return {
            placeholder: {
                /**
                 * Register each file in the side-store and insert an
                 * uploading placeholder node. Returns the new ids, in order.
                 */
                insert: (options: {
                    files: File[];
                    group?: TElement;
                }): string[] => {
                    const { files, group } = options;
                    const ids: string[] = [];

                    const nodes: TImagePlaceholderElement[] = files.map(
                        (file) => {
                            const id = createId();
                            ids.push(id);
                            setUpload(editor, id, {
                                file,
                                abort: new AbortController(),
                            });

                            return {
                                type: ELEMENT_IMAGE_PLACEHOLDER,
                                id,
                                name: file.name,
                                previewUrl: URL.createObjectURL(file),
                                status: 'uploading',
                                progress: 0,
                                children: [{ text: '' }],
                            };
                        },
                    );

                    if (group) {
                        const path = editor.api.findPath(group);
                        if (!path) return [];
                        editor.tf.insertNodes(nodes, {
                            at: [...path, group.children.length] as Path,
                        });
                    } else {
                        editor.tf.insertNodes({
                            type: 'image_group',
                            children: nodes,
                        });
                    }

                    return ids;
                },

                /** Patch a placeholder's transient state (progress/status/error). */
                update: (options: {
                    id: string;
                    patch: Partial<TImagePlaceholderElement>;
                }) => {
                    const entry = findEntry(options.id);
                    if (!entry) return;
                    editor.tf.setNodes(options.patch, { at: entry[1] });
                },

                /** Replace a successful placeholder with a committed image node. */
                resolve: (options: { id: string; url: string }) => {
                    const entry = findEntry(options.id);
                    if (!entry) return;

                    const [node, path] = entry;
                    URL.revokeObjectURL(node.previewUrl);
                    deleteUpload(editor, options.id);

                    const image: TImageElement = {
                        type: ELEMENT_IMAGE,
                        url: options.url,
                        children: [{ text: '' }],
                    };

                    editor.tf.withoutNormalizing(() => {
                        editor.tf.removeNodes({ at: path });
                        editor.tf.insertNodes(image, { at: path });
                    });
                },

                /** Abort + remove a placeholder (cancel or dismiss-error). */
                remove: (options: { id: string }) => {
                    const entry = findEntry(options.id);
                    const stored = getUpload(editor, options.id);
                    stored?.abort.abort();

                    if (entry) {
                        URL.revokeObjectURL(entry[0].previewUrl);
                        editor.tf.removeNodes({ at: entry[1] });
                    }
                    deleteUpload(editor, options.id);
                },
            },
        };
    })
    .withComponent(ImagePlaceholderElement);

export const ImagePlaceholderKit = [ImagePlaceholderPlugin];

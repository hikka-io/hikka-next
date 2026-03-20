'use client';

import { ElementApi, KEYS, type TElement } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { createPlatePlugin } from 'platejs/react';

import { SpoilerElement } from '@/components/plate/ui/spoiler-node';

import { insertBlock } from '../transforms';

export const ELEMENT_SPOILER = 'spoiler';

export const SpoilerPlugin = createPlatePlugin({
    key: ELEMENT_SPOILER,
    node: {
        isElement: true,
        component: SpoilerElement,
    },
    shortcuts: {
        toggleSpoiler: {
            keys: ['mod+opt+s', 'mod+shift+s'],
            handler: ({ editor }: { editor: PlateEditor }) => {
                const selection = editor.selection;
                if (!selection) return;

                // Check if we're inside a spoiler
                const spoilerEntry = editor.api.block({
                    match: { type: ELEMENT_SPOILER },
                });

                if (spoilerEntry) {
                    // If inside spoiler, unwrap it
                    editor.tf.unwrapNodes({
                        match: { type: ELEMENT_SPOILER },
                    });
                } else if (!editor.api.isCollapsed()) {
                    // Wrap selected content in spoiler
                    editor.tf.wrapNodes({
                        type: ELEMENT_SPOILER,
                        children: [],
                    });
                } else {
                    insertBlock(editor, ELEMENT_SPOILER);
                }
            },
            preventDefault: true,
        },
    },
    rules: {
        break: {
            emptyLineEnd: 'exit',
            default: 'lineBreak',
            empty: 'reset',
        },
    },
    parsers: {
        html: {
            deserializer: {
                rules: [
                    {
                        validNodeName: 'DIV',
                        validClassName: 'spoiler',
                    },
                ],
                parse: ({ element }) => ({
                    type: ELEMENT_SPOILER,
                    // Let Plate handle children parsing, but we'll normalize after
                }),
            },
        },
    },
}).overrideEditor(({ editor, tf: { normalizeNode, deleteBackward } }) => {
    return {
        transforms: {
            deleteBackward(unit) {
                const selection = editor.selection;
                if (!selection) return deleteBackward(unit);

                const block = editor.api.block();
                if (block) {
                    const [node, blockPath] = block;
                    const parentEntry = editor.api.parent(blockPath);

                    if (
                        parentEntry &&
                        ElementApi.isElement(parentEntry[0]) &&
                        parentEntry[0].type === ELEMENT_SPOILER
                    ) {
                        const [spoilerNode, spoilerPath] = parentEntry;
                        const isFirstChild =
                            blockPath[blockPath.length - 1] === 0;
                        const isAtStart = editor.api.isStart(
                            selection.anchor,
                            blockPath,
                        );

                        // Backspace at start of the first empty child in a spoiler
                        if (
                            isFirstChild &&
                            isAtStart &&
                            editor.api.isEmpty(node)
                        ) {
                            if (spoilerNode.children.length === 1) {
                                // Only child — remove the spoiler entirely
                                editor.tf.removeNodes({ at: spoilerPath });
                                editor.tf.insertNodes(
                                    {
                                        type: KEYS.p,
                                        children: [{ text: '' }],
                                    } as TElement,
                                    { at: spoilerPath, select: true },
                                );
                                return;
                            }
                        }
                    }
                }

                deleteBackward(unit);
            },
            normalizeNode([node, path]) {
                if (ElementApi.isElement(node)) {
                    if (node.type === ELEMENT_SPOILER) {
                        const { children } = node;

                        // Ensure spoiler has children
                        if (!children || children.length === 0) {
                            editor.tf.insertNodes(
                                {
                                    type: KEYS.p,
                                    children: [{ text: '' }],
                                } as TElement,
                                { at: [...path, 0] },
                            );
                            return;
                        }

                        // Ensure no direct text children (only block elements)
                        for (let i = 0; i < children.length; i++) {
                            const child = children[i];
                            if (editor.api.isText(child)) {
                                editor.tf.replaceNodes(
                                    {
                                        type: KEYS.p,
                                        children: [child],
                                    } as TElement,
                                    { at: [...path, i] },
                                );
                                return;
                            }
                        }

                        // Ensure trailing paragraph after nested spoiler
                        const lastChild = children[children.length - 1];
                        if (
                            ElementApi.isElement(lastChild) &&
                            lastChild.type === ELEMENT_SPOILER
                        ) {
                            editor.tf.insertNodes(
                                {
                                    type: KEYS.p,
                                    children: [{ text: '' }],
                                } as TElement,
                                { at: [...path, children.length] },
                            );
                            return;
                        }
                    }
                }

                normalizeNode([node, path]);
            },
        },
    };
});

export const SpoilerKit = [SpoilerPlugin];

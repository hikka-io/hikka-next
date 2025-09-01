'use client';

import { ElementApi, KEYS } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { createPlatePlugin } from 'platejs/react';

import { SpoilerElement } from '@/components/plate/ui/spoiler-node';

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
                // Get current selection
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
                } else {
                    // Create spoiler with paragraph as first child
                    const spoilerNode = {
                        type: ELEMENT_SPOILER,
                        children: [
                            {
                                type: KEYS.p,
                                children: [{ text: '' }],
                            },
                        ],
                    };

                    // If we have selected content, wrap it
                    if (editor.selection && !editor.api.isCollapsed()) {
                        editor.tf.wrapNodes(spoilerNode);
                    } else {
                        // Insert new spoiler block
                        editor.tf.insertNodes(spoilerNode);
                    }
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
}).overrideEditor(({ editor, tf: { normalizeNode } }) => {
    return {
        transforms: {
            normalizeNode([node, path]) {
                if (ElementApi.isElement(node)) {
                    if (node.type === ELEMENT_SPOILER) {
                        const { children } = node;

                        // Ensure spoiler has children
                        if (!children || children.length === 0) {
                            const paragraphNode = {
                                type: KEYS.p,
                                children: [{ text: '' }],
                            };
                            editor.tf.insertNodes(paragraphNode, {
                                at: [...path, 0],
                            });
                            return;
                        }

                        // Ensure no direct text children (only block elements)
                        for (let i = 0; i < children.length; i++) {
                            const child = children[i];
                            if (editor.api.isText(child)) {
                                // Convert text node to paragraph
                                const paragraphNode = {
                                    type: KEYS.p,
                                    children: [child],
                                };
                                editor.tf.replaceNodes(paragraphNode, {
                                    at: [...path, i],
                                });
                                return;
                            }
                        }

                        // Ensure first child is a paragraph if not already
                        const firstChild = children[0];
                        if (
                            firstChild &&
                            ElementApi.isElement(firstChild) &&
                            firstChild.type !== KEYS.p
                        ) {
                            // Insert paragraph at the beginning
                            const paragraphNode = {
                                type: KEYS.p,
                                children: [{ text: '' }],
                            };
                            editor.tf.insertNodes(paragraphNode, {
                                at: [...path, 0],
                            });
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

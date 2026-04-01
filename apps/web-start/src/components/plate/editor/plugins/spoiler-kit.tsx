'use client';

import { ElementApi, KEYS, type TElement } from 'platejs';
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
            handler: ({ editor }) => {
                editor.tf.toggleBlock(ELEMENT_SPOILER);
            },
            preventDefault: true,
        },
    },
    rules: {
        break: {
            default: 'lineBreak',
            empty: 'reset',
            emptyLineEnd: 'deleteExit',
        },
        delete: { start: 'reset' },
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
                parse: () => ({
                    type: ELEMENT_SPOILER,
                }),
            },
        },
    },
})
    .extendTransforms(({ editor, type }) => ({
        toggle: () => {
            editor.tf.toggleBlock(type);
        },
    }))
    .overrideEditor(({ editor, tf: { normalizeNode, resetBlock } }) => ({
        transforms: {
            resetBlock(options) {
                const entry = editor.api.block({
                    at: options?.at,
                    match: { type: ELEMENT_SPOILER },
                });

                if (entry) {
                    editor.tf.unwrapNodes({
                        at: entry[1],
                        match: { type: ELEMENT_SPOILER },
                    });
                    return;
                }

                return resetBlock(options);
            },
            normalizeNode([node, path]) {
                if (
                    ElementApi.isElement(node) &&
                    node.type === ELEMENT_SPOILER
                ) {
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

                normalizeNode([node, path]);
            },
        },
    }));

export const SpoilerKit = [SpoilerPlugin];

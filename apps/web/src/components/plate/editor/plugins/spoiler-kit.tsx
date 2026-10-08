import {
    type Descendant,
    ElementApi,
    KEYS,
    NodeApi,
    type Path,
    PathApi,
    type SlateEditor,
    type TElement,
} from 'platejs';
import { createPlatePlugin } from 'platejs/react';

import { SpoilerInlineElement } from '@/components/plate/ui/spoiler-inline-node';
import { SpoilerElement } from '@/components/plate/ui/spoiler-node';

import { ELEMENT_SPOILER, ELEMENT_SPOILER_INLINE } from '../plate-types';
import { toggleSpoiler } from '../transforms';

const toBlockChildren = (
    editor: SlateEditor,
    children: Descendant[] = [],
): TElement[] => {
    const paragraphType = editor.getType(KEYS.p);
    const blocks: TElement[] = [];
    let inlines: Descendant[] = [];

    const flushInlines = () => {
        if (inlines.length === 0) return;
        blocks.push({ type: paragraphType, children: inlines });
        inlines = [];
    };

    children.forEach((child) => {
        if (
            ElementApi.isElement(child) &&
            !editor.api.isInline(child) &&
            editor.api.isBlock(child)
        ) {
            flushInlines();
            blocks.push(child);
            return;
        }

        inlines.push(child);
    });

    flushInlines();

    if (blocks.length === 0) {
        return [{ type: paragraphType, children: [{ text: '' }] }];
    }

    // A trailing nested spoiler leaves nowhere to type after it
    const last = blocks[blocks.length - 1];
    if (ElementApi.isElement(last) && last.type === ELEMENT_SPOILER) {
        blocks.push({ type: paragraphType, children: [{ text: '' }] });
    }

    return blocks;
};

const isLiftableSpoilerChild = (
    editor: SlateEditor,
    node: TElement,
    path: Path,
) =>
    node.type === editor.getType(KEYS.p) &&
    !node[KEYS.listType] &&
    !!editor.api.above({
        at: path,
        match: (ancestor, ancestorPath) =>
            ancestorPath.length < path.length &&
            ancestor.type === ELEMENT_SPOILER,
    });

export const SpoilerPlugin = createPlatePlugin({
    key: ELEMENT_SPOILER,
    node: {
        isElement: true,
        component: SpoilerElement,
    },
    shortcuts: {
        toggle: { keys: ['mod+opt+s', 'mod+shift+s'] },
    },
    rules: {
        break: { empty: 'lift' },
        delete: { start: 'lift' },
        match: ({ editor, node, path, rule }) => {
            if (!path || !isLiftableSpoilerChild(editor, node, path)) {
                return false;
            }

            if (rule === 'break.empty') return true;

            // Backspace escapes only from the top of the spoiler — deeper in,
            // it still merges into the paragraph above.
            return rule === 'delete.start' && !PathApi.hasPrevious(path);
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
                parse: () => ({
                    type: ELEMENT_SPOILER,
                }),
            },
        },
    },
})
    .extendTransforms(({ editor }) => ({
        toggle: () => {
            toggleSpoiler(editor, {
                block: ELEMENT_SPOILER,
                inline: ELEMENT_SPOILER_INLINE,
            });
        },
    }))
    .overrideEditor(({ editor, tf: { normalizeNode }, type }) => ({
        transforms: {
            normalizeNode([node, path]) {
                if (ElementApi.isElement(node) && node.type === type) {
                    const children = toBlockChildren(editor, node.children);

                    if (
                        children.length !== node.children.length ||
                        children.some(
                            (child, index) => child !== node.children[index],
                        )
                    ) {
                        editor.tf.replaceNodes(children, {
                            at: path,
                            children: true,
                        });
                        return;
                    }
                }

                normalizeNode([node, path]);
            },
        },
    }));

export const SpoilerInlinePlugin = createPlatePlugin({
    key: ELEMENT_SPOILER_INLINE,
    node: {
        isElement: true,
        isInline: true,
        component: SpoilerInlineElement,
    },
}).overrideEditor(({ editor, tf: { normalizeNode }, type }) => ({
    transforms: {
        normalizeNode([node, path]) {
            if (ElementApi.isElement(node) && node.type === type) {
                const nested = node.children.findIndex(
                    (child) =>
                        ElementApi.isElement(child) && child.type === type,
                );

                if (nested !== -1) {
                    editor.tf.unwrapNodes({ at: [...path, nested] });
                    return;
                }

                if (NodeApi.string(node).length === 0) {
                    editor.tf.removeNodes({ at: path });
                    return;
                }
            }

            normalizeNode([node, path]);
        },
    },
}));

export const SpoilerKit = [SpoilerPlugin, SpoilerInlinePlugin];

'use client';

import { triggerFloatingLink } from '@platejs/link/react';
import { toggleList } from '@platejs/list-classic';
import {
    KEYS,
    type NodeEntry,
    type Path,
    PathApi,
    type TElement,
} from 'platejs';
import type { PlateEditor } from 'platejs/react';

// Block types that are containers (need a paragraph child, not bare text)
const CONTAINER_TYPES: Set<string> = new Set(['spoiler', KEYS.blockquote]);

// List types that should use toggleList instead of insertNodes
const LIST_TYPES: Set<string> = new Set([KEYS.ulClassic, KEYS.olClassic]);

/** Create a block node with proper children structure */
const createBlockNode = (editor: PlateEditor, type: string): TElement => {
    if (CONTAINER_TYPES.has(type)) {
        return {
            type,
            children: [
                { type: KEYS.p, children: [{ text: '' }] } as TElement,
            ],
        };
    }

    return editor.api.create.block({ type });
};

/**
 * Insert a new block.
 * - On an empty paragraph: replaces it
 * - On a non-empty block: inserts after
 * - Lists: uses toggleList (converts current block to list)
 */
export const insertBlock = (editor: PlateEditor, type: string) => {
    editor.tf.withoutNormalizing(() => {
        const block = editor.api.block();
        if (!block) return;

        const [node, path] = block;

        // Lists use toggleList — converts the current block to a list item
        if (LIST_TYPES.has(type)) {
            toggleList(editor, { type: editor.getType(type) as 'ul' | 'ol' });
            return;
        }

        const newNode = createBlockNode(editor, type);
        const isContainer = CONTAINER_TYPES.has(type);

        // Replace empty paragraph, otherwise insert after
        let insertPath: Path;
        if (node.type === KEYS.p && editor.api.isEmpty(node)) {
            editor.tf.removeNodes({ at: path });
            insertPath = path;
        } else {
            insertPath = PathApi.next(path);
        }

        editor.tf.insertNodes(newNode, { at: insertPath, select: true });

        // Container blocks always get a trailing paragraph so the user
        // can continue typing after them
        if (isContainer) {
            editor.tf.insertNodes(
                {
                    type: KEYS.p,
                    children: [{ text: '' }],
                } as TElement,
                { at: PathApi.next(insertPath) },
            );
        }
    });
};

const insertInlineMap: Record<
    string,
    (editor: PlateEditor, type: string) => void
> = {
    [KEYS.link]: (editor) => triggerFloatingLink(editor, { focused: true }),
};

export const insertInlineElement = (editor: PlateEditor, type: string) => {
    if (insertInlineMap[type]) {
        insertInlineMap[type](editor, type);
    }
};

const setBlockMap: Record<
    string,
    (editor: PlateEditor, type: string) => void
> = {
    [KEYS.olClassic]: (editor) =>
        toggleList(editor, { type: editor.getType(KEYS.olClassic) }),
    [KEYS.taskList]: (editor) =>
        toggleList(editor, { type: editor.getType(KEYS.taskList) }),
    [KEYS.ulClassic]: (editor) =>
        toggleList(editor, { type: editor.getType(KEYS.ulClassic) }),
};

export const setBlockType = (
    editor: PlateEditor,
    type: string,
    { at }: { at?: Path } = {},
) => {
    editor.tf.withoutNormalizing(() => {
        const setEntry = (entry: NodeEntry<TElement>) => {
            const [node, path] = entry;

            if (type in setBlockMap) {
                return setBlockMap[type](editor, type);
            }
            if (node.type !== type) {
                editor.tf.setNodes({ type }, { at: path });
            }
        };

        if (at) {
            const entry = editor.api.node<TElement>(at);

            if (entry) {
                setEntry(entry);

                return;
            }
        }

        const entries = editor.api.blocks({ mode: 'lowest' });

        entries.forEach((entry) => setEntry(entry));
    });
};

export const getBlockType = (block: TElement) => {
    return block.type;
};

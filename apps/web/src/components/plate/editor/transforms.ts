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

const insertInlineMap: Record<
    string,
    (editor: PlateEditor, type: string) => void
> = {
    [KEYS.link]: (editor) => triggerFloatingLink(editor, { focused: true }),
};

const insertBlockBase = (editor: PlateEditor, type: string) => {
    const block = editor.api.block();

    if (!block) return;
    editor.tf.insertNodes(editor.api.create.block({ type }), {
        at: PathApi.next(block[1]),
        select: true,
    });
};
export const insertBlock = (editor: PlateEditor, type: string) => {
    editor.tf.withoutNormalizing(() => {
        insertBlockBase(editor, type);
    });
};

export const insertInlineElement = (editor: PlateEditor, type: string) => {
    if (insertInlineMap[type]) {
        insertInlineMap[type](editor, type);
    }
};

const setBlockMap: Record<string, (editor: PlateEditor, type: string) => void> =
    {
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

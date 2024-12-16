'use client';

import {
    type TElement,
    type TNodeEntry,
    getBlocks,
    getNodeEntry,
    insertEmptyElement,
    insertNodes,
    setNodes,
    withoutNormalizing,
} from '@udecode/plate-common';
import { type PlateEditor, focusEditor } from '@udecode/plate-common/react';
import { LinkPlugin, triggerFloatingLink } from '@udecode/plate-link/react';
import { Path } from 'slate';

const insertList = (editor: PlateEditor, type: string) => {
    insertNodes(
        editor,
        editor.api.create.block({
            indent: 1,
            listStyleType: type,
        }),
        { select: true },
    );
};

const insertInlineMap: Record<
    string,
    (editor: PlateEditor, type: string) => void
> = {
    [LinkPlugin.key]: (editor) =>
        triggerFloatingLink(editor, { focused: true }),
};

export const insertBlock = (editor: PlateEditor, type: string) => {
    withoutNormalizing(editor, () => {
        insertEmptyElement(editor, type, {
            select: true,
            nextBlock: false,
        });

        focusEditor(editor);
    });
};

export const insertInlineElement = (editor: PlateEditor, type: string) => {
    if (insertInlineMap[type]) {
        insertInlineMap[type](editor, type);
    }
};

const setList = (
    editor: PlateEditor,
    type: string,
    entry: TNodeEntry<TElement>,
) => {
    setNodes(
        editor,
        editor.api.create.block({
            indent: 1,
            listStyleType: type,
        }),
        {
            at: entry[1],
        },
    );
};

export const setBlockType = (
    editor: PlateEditor,
    type: string,
    { at }: { at?: Path } = {},
) => {
    withoutNormalizing(editor, () => {
        const setEntry = (entry: TNodeEntry<TElement>) => {
            const [node, path] = entry;

            if (node.type !== type) {
                editor.setNodes<TElement>({ type }, { at: path });
            }
        };

        if (at) {
            const entry = getNodeEntry<TElement>(editor, at);

            if (entry) {
                setEntry(entry);

                return;
            }
        }

        const entries = getBlocks(editor);

        entries.forEach((entry) => setEntry(entry));
    });
};

export const getBlockType = (block: TElement) => {
    return block.type;
};

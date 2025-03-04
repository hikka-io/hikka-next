'use client';

import { type NodeEntry, type TElement } from '@udecode/plate';
import { LinkPlugin, triggerFloatingLink } from '@udecode/plate-link/react';
import { type PlateEditor } from '@udecode/plate/react';
import { Path } from 'slate';

const insertList = (editor: PlateEditor, type: string) => {
    editor.tf.insertNodes(
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
    editor.tf.withoutNormalizing(() => {
        editor.tf.insertNodes(editor.api.create.block({ type }));
        editor.tf.focus();
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
    entry: NodeEntry<TElement>,
) => {
    editor.tf.setNodes(
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
    editor.tf.withoutNormalizing(() => {
        const setEntry = (entry: NodeEntry<TElement>) => {
            const [node, path] = entry;

            if (node.type !== type) {
                editor.tf.setNodes<TElement>({ type }, { at: path });
            }
        };

        if (at) {
            const entry = editor.api.node<TElement>(at);

            if (entry) {
                setEntry(entry);

                return;
            }
        }

        const entries = editor.api.blocks();

        entries.forEach((entry) => setEntry(entry));
    });
};

export const getBlockType = (block: TElement) => {
    return block.type;
};

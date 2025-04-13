'use client';

import { type NodeEntry, PathApi, type TElement } from '@udecode/plate';
import { insertToc } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { LinkPlugin, triggerFloatingLink } from '@udecode/plate-link/react';
import {
    TableCellPlugin,
    TablePlugin,
    TableRowPlugin,
} from '@udecode/plate-table/react';
import type { PlateEditor } from '@udecode/plate/react';

export const STRUCTURAL_TYPES: string[] = [
    TablePlugin.key,
    TableRowPlugin.key,
    TableCellPlugin.key,
];

const ACTION_THREE_COLUMNS = 'action_three_columns';

const insertList = (editor: PlateEditor, type: string) => {
    editor.tf.insertNodes(
        editor.api.create.block({
            indent: 1,
            listStyleType: type,
        }),
        { select: true },
    );
};

const insertBlockMap: Record<
    string,
    (editor: PlateEditor, type: string) => void
> = {
    [TablePlugin.key]: (editor) =>
        editor.getTransforms(TablePlugin).insert.table({}, { select: true }),
    [TocPlugin.key]: (editor) => insertToc(editor, { select: true }),
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
        const block = editor.api.block();

        if (!block) return;
        if (type in insertBlockMap) {
            insertBlockMap[type](editor, type);
        } else {
            editor.tf.insertNodes(editor.api.create.block({ type }), {
                at: PathApi.next(block[1]),
                select: true,
            });
        }
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

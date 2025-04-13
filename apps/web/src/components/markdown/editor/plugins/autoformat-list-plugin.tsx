'use client';

import { ElementApi, type SlateEditor } from '@udecode/plate';
import type {
    AutoformatBlockRule,
    AutoformatRule,
} from '@udecode/plate-autoformat';
import {
    autoformatArrow,
    autoformatLegal,
    autoformatLegalHtml,
    autoformatMath,
    autoformatPunctuation,
    autoformatSmartQuotes,
} from '@udecode/plate-autoformat';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { toggleList, unwrapList } from '@udecode/plate-list';
import {
    BulletedListPlugin,
    ListItemPlugin,
    NumberedListPlugin,
} from '@udecode/plate-list/react';

export const preFormat: AutoformatBlockRule['preFormat'] = (editor) =>
    unwrapList(editor);
export const format = (editor: SlateEditor, customFormatting: any) => {
    if (editor.selection) {
        const parentEntry = editor.api.parent(editor.selection);
        if (!parentEntry) return;
        const [node] = parentEntry;
        if (ElementApi.isElement(node)) {
            customFormatting();
        }
    }
};
export const formatList = (editor: SlateEditor, elementType: string) => {
    format(editor, () =>
        toggleList(editor, {
            type: elementType,
        }),
    );
};
export const autoformatMarks: AutoformatRule[] = [
    {
        match: '***',
        mode: 'mark',
        type: [BoldPlugin.key, ItalicPlugin.key],
    },
    {
        match: '**',
        mode: 'mark',
        type: BoldPlugin.key,
    },
    {
        match: '*',
        mode: 'mark',
        type: ItalicPlugin.key,
    },
    {
        match: '_',
        mode: 'mark',
        type: ItalicPlugin.key,
    },
];
export const autoformatBlocks: AutoformatRule[] = [
    {
        match: '> ',
        mode: 'block',
        preFormat,
        type: BlockquotePlugin.key,
    },
];
export const autoformatLists: AutoformatRule[] = [
    {
        format: (editor) => formatList(editor, BulletedListPlugin.key),
        match: ['* ', '- '],
        mode: 'block',
        preFormat,
        type: ListItemPlugin.key,
    },
    {
        format: (editor) => formatList(editor, NumberedListPlugin.key),
        match: [String.raw`^\d+\.$ `, String.raw`^\d+\)$ `],
        matchByRegex: true,
        mode: 'block',
        preFormat,
        type: ListItemPlugin.key,
    },
];
export const autoformatListPlugin = AutoformatPlugin.configure({
    options: {
        enableUndoOnDelete: true,
        rules: [
            ...autoformatBlocks,
            ...autoformatMarks,
            ...autoformatSmartQuotes,
            ...autoformatPunctuation,
            ...autoformatLegal,
            ...autoformatLegalHtml,
            ...autoformatArrow,
            ...autoformatMath,
            ...autoformatLists,
        ],
    },
});

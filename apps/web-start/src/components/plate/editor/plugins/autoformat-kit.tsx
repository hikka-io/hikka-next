'use client';

import type { AutoformatRule } from '@platejs/autoformat';
import {
    AutoformatPlugin,
    autoformatArrow,
    autoformatLegal,
    autoformatLegalHtml,
    autoformatPunctuation,
    autoformatSmartQuotes,
} from '@platejs/autoformat';
import { KEYS } from 'platejs';

const autoformatMarks: AutoformatRule[] = [
    {
        match: '***',
        mode: 'mark',
        type: [KEYS.bold, KEYS.italic],
    },
    {
        match: '**',
        mode: 'mark',
        type: KEYS.bold,
    },
    {
        match: '*',
        mode: 'mark',
        type: KEYS.italic,
    },
    {
        match: '_',
        mode: 'mark',
        type: KEYS.italic,
    },
];

const autoformatBlocks: AutoformatRule[] = [
    {
        match: '### ',
        mode: 'block',
        type: KEYS.h3,
    },
    {
        match: '> ',
        mode: 'block',
        type: KEYS.blockquote,
    },
];

export const AutoformatArticleKit = [
    AutoformatPlugin.configure({
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
            ].map(
                (rule): AutoformatRule => ({
                    ...rule,
                    query: (editor) =>
                        !editor.api.some({
                            match: { type: editor.getType(KEYS.codeBlock) },
                        }),
                }),
            ),
        },
    }),
];

export const AutoformatCommentKit = [
    AutoformatPlugin.configure({
        options: {
            enableUndoOnDelete: true,
            rules: [
                ...autoformatBlocks.filter((a) => a.match !== '### '),
                ...autoformatMarks,
                ...autoformatSmartQuotes,
                ...autoformatPunctuation,
                ...autoformatLegal,
                ...autoformatLegalHtml,
                ...autoformatArrow,
            ].map(
                (rule): AutoformatRule => ({
                    ...rule,
                    query: (editor) =>
                        !editor.api.some({
                            match: { type: editor.getType(KEYS.codeBlock) },
                        }),
                }),
            ),
        },
    }),
];

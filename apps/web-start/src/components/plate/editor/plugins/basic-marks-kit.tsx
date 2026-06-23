'use client';

import { BoldRules, ItalicRules } from '@platejs/basic-nodes';
import { BoldPlugin, ItalicPlugin } from '@platejs/basic-nodes/react';
import { KEYS, createMarkInputRule } from 'platejs';

export const BasicMarksKit = [
    BoldPlugin.configure({
        inputRules: [
            // ***text*** -> bold + italic
            createMarkInputRule({
                start: '***',
                end: '**',
                trigger: '*',
                marks: [KEYS.bold, KEYS.italic],
            }),
            BoldRules.markdown({ variant: '*' }),
        ],
    }),
    ItalicPlugin.configure({
        inputRules: [
            ItalicRules.markdown({ variant: '*' }),
            ItalicRules.markdown({ variant: '_' }),
        ],
    }),
];

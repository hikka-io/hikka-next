'use client';

import { BoldRules, ItalicRules, MarkComboRules } from '@platejs/basic-nodes';
import { BoldPlugin, ItalicPlugin } from '@platejs/basic-nodes/react';

export const BasicMarksKit = [
    BoldPlugin.configure({
        inputRules: [
            MarkComboRules.markdown({ variant: 'boldItalic' }),
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

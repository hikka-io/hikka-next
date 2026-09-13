import {
    BoldRules,
    ItalicRules,
    StrikethroughRules,
    UnderlineRules,
} from '@platejs/basic-nodes';
import {
    BoldPlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { createMarkInputRule, KEYS } from 'platejs';

export const BasicMarksKit = [
    UnderlinePlugin.configure({
        inputRules: [UnderlineRules.markdown()],
    }),
    StrikethroughPlugin.configure({
        inputRules: [StrikethroughRules.markdown()],
    }),
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

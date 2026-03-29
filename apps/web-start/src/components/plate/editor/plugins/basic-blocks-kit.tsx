'use client';

import { BlockquotePlugin } from '@platejs/basic-nodes/react';
import { KEYS } from 'platejs';
import { ParagraphPlugin } from 'platejs/react';

import { BlockquoteElement } from '@/components/plate/ui/blockquote-node';
import { ParagraphElement } from '@/components/plate/ui/paragraph-node';

export const BasicBlocksKit = [
    ParagraphPlugin.withComponent(ParagraphElement),
    BlockquotePlugin.configure({
        node: { component: BlockquoteElement },
        shortcuts: { toggle: { keys: 'mod+shift+period' } },
    }).overrideEditor(({ editor, tf: { resetBlock } }) => ({
        transforms: {
            resetBlock(options) {
                const entry = editor.api.block({
                    at: options?.at,
                    match: { type: KEYS.blockquote },
                });

                if (entry) {
                    editor.tf.unwrapNodes({
                        at: entry[1],
                        match: { type: KEYS.blockquote },
                    });
                    return;
                }

                return resetBlock(options);
            },
        },
    })),
];

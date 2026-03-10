'use client';

import { BlockquotePlugin } from '@platejs/basic-nodes/react';
import { ParagraphPlugin } from 'platejs/react';

import { BlockquoteElement } from '@/components/plate/ui/blockquote-node';
import { ParagraphElement } from '@/components/plate/ui/paragraph-node';

export const BasicBlocksKit = [
    ParagraphPlugin.withComponent(ParagraphElement),
    BlockquotePlugin.configure({
        node: { component: BlockquoteElement },
        shortcuts: { toggle: { keys: 'mod+shift+period' } },
    }),
];

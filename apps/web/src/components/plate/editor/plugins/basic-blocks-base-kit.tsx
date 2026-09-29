import { BaseBlockquotePlugin } from '@platejs/basic-nodes';
import { BaseParagraphPlugin } from 'platejs';

import { BlockquoteElementStatic } from '@/components/plate/ui/blockquote-node-static';
import { ParagraphElementStatic } from '@/components/plate/ui/paragraph-node-static';

export const BaseParagraphKit = [
    BaseParagraphPlugin.withComponent(ParagraphElementStatic),
];

export const BaseBlockquoteKit = [
    BaseBlockquotePlugin.withComponent(BlockquoteElementStatic),
];

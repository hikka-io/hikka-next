import {
    BaseBlockquotePlugin,
    BaseH1Plugin,
    BaseH2Plugin,
    BaseH3Plugin,
    BaseH4Plugin,
    BaseH5Plugin,
} from '@platejs/basic-nodes';
import { BaseParagraphPlugin } from 'platejs';

import { BlockquoteElementStatic } from '@/components/plate/ui/blockquote-node-static';
import {
    H1ElementStatic,
    H2ElementStatic,
    H3ElementStatic,
    H4ElementStatic,
    H5ElementStatic,
} from '@/components/plate/ui/heading-node-static';
import { ParagraphElementStatic } from '@/components/plate/ui/paragraph-node-static';

export const BaseBasicBlocksKit = [
    BaseParagraphPlugin.withComponent(ParagraphElementStatic),
    BaseH1Plugin.withComponent(H1ElementStatic),
    BaseH2Plugin.withComponent(H2ElementStatic),
    BaseH3Plugin.withComponent(H3ElementStatic),
    BaseH4Plugin.withComponent(H4ElementStatic),
    BaseH5Plugin.withComponent(H5ElementStatic),
    BaseBlockquotePlugin.withComponent(BlockquoteElementStatic),
];

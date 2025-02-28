import { withProps } from '@udecode/cn';
import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react';
import {
    ParagraphPlugin,
    PlateElement,
    PlateLeaf,
} from '@udecode/plate-common/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
    BulletedListPlugin,
    ListItemPlugin,
    NumberedListPlugin,
} from '@udecode/plate-list/react';

import Blockquote, {
    BlockquoteClassName,
} from '@/components/typography/blockquote';
import Li from '@/components/typography/li';
import Ol from '@/components/typography/ol';
import P from '@/components/typography/p';
import Spoiler from '@/components/typography/spoiler';
import Ul from '@/components/typography/ul';

import { EmojiInputElement } from './plate-ui/emoji-input-element';
import { ImageElement } from './plate-ui/image-element';
import { ImageGroupElement } from './plate-ui/image-group-element';
import { LinkElement } from './plate-ui/link-element';
import { LinkViewElement } from './plate-ui/link-view-element';
import { ListElement } from './plate-ui/list-element';
import { SpoilerElement } from './plate-ui/spoiler-element';
import {
    ImageGroupPlugin,
    ImagePlugin,
} from './plugins/image-group-plugin/image-group-plugin';
import { SpoilerPlugin } from './plugins/spoiler-plugin/spoiler-plugin';

export const editorComponents = {
    [EmojiInputPlugin.key]: EmojiInputElement,
    [BulletedListPlugin.key]: withProps(ListElement, {
        variant: 'ul',
        className: 'mb-4',
    }),
    [ListItemPlugin.key]: withProps(PlateElement, {
        as: 'li',
        className: 'ps-2',
    }),
    [NumberedListPlugin.key]: withProps(ListElement, {
        variant: 'ol',
        className: 'mb-4',
    }),
    [LinkPlugin.key]: LinkElement,
    [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
    [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
    [ParagraphPlugin.key]: withProps(PlateElement, {
        as: 'p',
        className: 'mb-4',
    }),
    blockquote: withProps(PlateElement, {
        as: 'blockquote',
        className: BlockquoteClassName,
    }),
    [SpoilerPlugin.key]: SpoilerElement,
    [ImageGroupPlugin.key]: ImageGroupElement,
    [ImagePlugin.key]: ImageElement,
};

export const viewerComponents = {
    [SpoilerPlugin.key]: withProps(Spoiler, {
        className: 'mb-4',
    }),
    [LinkPlugin.key]: LinkViewElement,
    [ParagraphPlugin.key]: withProps(P, {
        className: 'mb-4',
    }),
    blockquote: withProps(Blockquote, {
        className: 'mb-4',
    }),
    [BulletedListPlugin.key]: withProps(Ul, {
        className: 'mb-4',
    }),
    [NumberedListPlugin.key]: withProps(Ol, {
        className: 'mb-4',
    }),
    [ListItemPlugin.key]: Li,
};

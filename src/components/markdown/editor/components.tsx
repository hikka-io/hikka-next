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

import Blockquote from '@/components/typography/blockquote';

/* import { MediaImageViewElement } from './plate-ui/media-image-view-element';
import { MediaViewElement } from './plate-ui/media-view-element'; */
import P from '@/components/typography/p';

import { EmojiInputElement } from './plate-ui/emoji-input-element';
import { ImageElement } from './plate-ui/image-element';
import { ImageGroupElement } from './plate-ui/image-group-element';
import { LinkElement } from './plate-ui/link-element';
import { LinkViewElement } from './plate-ui/link-view-element';
import { ListElement } from './plate-ui/list-element';
import { ListViewElement } from './plate-ui/list-view-element';
import { SpoilerElement } from './plate-ui/spoiler-element';
import { SpoilerViewElement } from './plate-ui/spoiler-view-element';
import {
    ImageGroupPlugin,
    ImagePlugin,
} from './plugins/image-group-plugin/image-group-plugin';
import { SpoilerPlugin } from './plugins/spoiler-plugin/spoiler-plugin';

export const editorComponents = {
    [EmojiInputPlugin.key]: EmojiInputElement,
    [BulletedListPlugin.key]: withProps(ListElement, {
        variant: 'ul',
    }),
    [ListItemPlugin.key]: withProps(PlateElement, {
        as: 'li',
        className: 'my-2',
    }),
    [NumberedListPlugin.key]: withProps(ListElement, {
        variant: 'ol',
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
        className: 'mb-4 border-l-2 pl-6 italic border-border',
    }),
    [SpoilerPlugin.key]: SpoilerElement,
    [ImageGroupPlugin.key]: ImageGroupElement,
    [ImagePlugin.key]: ImageElement,
};

export const viewerComponents = {
    [SpoilerPlugin.key]: SpoilerViewElement,
    [LinkPlugin.key]: LinkViewElement,
    [ParagraphPlugin.key]: withProps(P, {
        className: 'mb-4',
    }),
    blockquote: withProps(Blockquote, {
        className: 'mb-4',
    }),
    [BulletedListPlugin.key]: withProps(ListViewElement, {
        variant: 'ul',
    }),
    [NumberedListPlugin.key]: withProps(ListViewElement, {
        variant: 'ol',
    }),
};

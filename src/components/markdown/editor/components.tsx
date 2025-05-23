import { withProps } from '@udecode/cn';
import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
    BulletedListPlugin,
    ListItemPlugin,
    NumberedListPlugin,
} from '@udecode/plate-list/react';

/* import {
    TableCellHeaderPlugin,
    TableCellPlugin,
    TablePlugin,
    TableRowPlugin,
} from '@udecode/plate-table/react'; */
import { ParagraphPlugin, PlateElement, PlateLeaf } from '@udecode/plate/react';

import Blockquote, {
    BLOCKQUOTE_CLASSNAME,
} from '@/components/typography/blockquote';
import H3 from '@/components/typography/h3';
import H4 from '@/components/typography/h4';
import H5 from '@/components/typography/h5';
import Li from '@/components/typography/li';
import Ol from '@/components/typography/ol';
import P from '@/components/typography/p';
import Spoiler from '@/components/typography/spoiler';
import Ul from '@/components/typography/ul';

import { cn } from '@/utils/utils';

import { EmojiInputElement } from './plate-ui/emoji-input-element';
import { HeadingElement } from './plate-ui/heading-element';
import { ImageElement } from './plate-ui/image-element';
import { ImageGroupElement } from './plate-ui/image-group-element';
import { ImageGroupViewElement } from './plate-ui/image-group-view-element';
import { ImageViewElement } from './plate-ui/image-view-element';
import { LinkElement } from './plate-ui/link-element';
import { LinkViewElement } from './plate-ui/link-view-element';
import { ListElement } from './plate-ui/list-element';
import { SpoilerElement } from './plate-ui/spoiler-element';
import { VideoElement } from './plate-ui/video-element';
import { VideoViewElement } from './plate-ui/video-view-element';
import {
    ImageGroupPlugin,
    ImagePlugin,
} from './plugins/image-group-plugin/image-group-plugin';
import { SpoilerPlugin } from './plugins/spoiler-plugin/spoiler-plugin';
import { VideoPlugin } from './plugins/video-plugin/video-plugin';

export const editorComponents = {
    [EmojiInputPlugin.key]: EmojiInputElement,
    [BulletedListPlugin.key]: withProps(ListElement, {
        variant: 'ul',
        className: 'mb-4',
    }),
    [HEADING_KEYS.h3]: withProps(HeadingElement, {
        variant: 'h3',
        className: 'mb-4',
    }),
    [HEADING_KEYS.h4]: withProps(HeadingElement, {
        variant: 'h4',
        className: 'mb-4',
    }),
    [HEADING_KEYS.h5]: withProps(HeadingElement, {
        variant: 'h5',
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
        className: cn(BLOCKQUOTE_CLASSNAME, 'mb-4'),
    }),
    [SpoilerPlugin.key]: SpoilerElement,
    [ImageGroupPlugin.key]: ImageGroupElement,
    [ImagePlugin.key]: ImageElement,
    [VideoPlugin.key]: VideoElement,
    /*     [TableCellHeaderPlugin.key]: TableCellHeaderElement,
    [TableCellPlugin.key]: TableCellElement,
    [TablePlugin.key]: TableElement,
    [TableRowPlugin.key]: TableRowElement, */
};

export const viewerComponents = {
    [HEADING_KEYS.h3]: withProps(H3, {
        className: 'mb-4',
    }),
    [HEADING_KEYS.h4]: withProps(H4, {
        className: 'mb-4',
    }),
    [HEADING_KEYS.h5]: withProps(H5, {
        className: 'mb-4',
    }),
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
    [ImageGroupPlugin.key]: ImageGroupViewElement,
    [ImagePlugin.key]: ImageViewElement,
    [VideoPlugin.key]: VideoViewElement,
};

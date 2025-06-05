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

import { cn } from '@/utils/utils';

import Blockquote, { BLOCKQUOTE_CLASSNAME } from '../../typography/blockquote';
import H3 from '../../typography/h3';
import H4 from '../../typography/h4';
import H5 from '../../typography/h5';
import Li from '../../typography/li';
import Ol from '../../typography/ol';
import P from '../../typography/p';
import Spoiler from '../../typography/spoiler';
import Ul from '../../typography/ul';
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

// Define the components object directly to avoid type issues
export const viewerComponents = {
    [HEADING_KEYS.h3]: ({
        className,
        ...props
    }: React.ComponentProps<typeof H3>) => (
        <H3 className={cn('mb-4', className)} {...props} />
    ),
    [HEADING_KEYS.h4]: ({
        className,
        ...props
    }: React.ComponentProps<typeof H4>) => (
        <H4 className={cn('mb-4', className)} {...props} />
    ),
    [HEADING_KEYS.h5]: ({
        className,
        ...props
    }: React.ComponentProps<typeof H5>) => (
        <H5 className={cn('mb-4', className)} {...props} />
    ),
    [SpoilerPlugin.key]: ({
        className,
        ...props
    }: React.ComponentProps<typeof Spoiler>) => (
        <Spoiler className={cn('mb-4', className)} {...props} />
    ),
    [LinkPlugin.key]: LinkViewElement,
    [ParagraphPlugin.key]: ({
        className,
        ...props
    }: React.ComponentProps<typeof P>) => (
        <P className={cn('mb-4', className)} {...props} />
    ),
    blockquote: ({
        className,
        ...props
    }: React.ComponentProps<typeof Blockquote>) => (
        <Blockquote className={cn('mb-4', className)} {...props} />
    ),
    [BulletedListPlugin.key]: ({
        className,
        ...props
    }: React.ComponentProps<typeof Ul>) => (
        <Ul className={cn('mb-4', className)} {...props} />
    ),
    [NumberedListPlugin.key]: ({
        className,
        ...props
    }: React.ComponentProps<typeof Ol>) => (
        <Ol className={cn('mb-4', className)} {...props} />
    ),
    [ListItemPlugin.key]: Li,
    [ImageGroupPlugin.key]: ImageGroupViewElement,
    [ImagePlugin.key]: ImageViewElement,
    [VideoPlugin.key]: VideoViewElement,
};

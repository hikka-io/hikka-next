import {
    MARK_BOLD,
    MARK_ITALIC,
    createBoldPlugin,
    createItalicPlugin,
} from '@udecode/plate-basic-marks';
import {
    createExitBreakPlugin,
    createSoftBreakPlugin,
} from '@udecode/plate-break';
import {
    PlateElement,
    RenderAfterEditable,
    createPlugins,
} from '@udecode/plate-common';
import { ELEMENT_LINK, createLinkPlugin } from '@udecode/plate-link';
import { createListPlugin } from '@udecode/plate-list';
import {
    ELEMENT_PARAGRAPH,
    createParagraphPlugin,
} from '@udecode/plate-paragraph';

import { withCn } from '@/utils/utils';

import { createDiffPlugin } from './plate-ui/diff-plugin';
import ItalicLeaf from './plate-ui/italic-leaf';
import LinkElement from './plate-ui/link-element';
import { LinkFloatingToolbar } from './plate-ui/link-floating-toolbar';
import SpoilerElement from './plate-ui/spoiler-element';
import {
    ELEMENT_SPOILER,
    createSpoilerPlugin,
} from './plate-ui/spoiler-plugin';
import StrongLeaf from './plate-ui/strong-leaf';
import { createDeserializeMdPlugin } from './serializer-md';

export const ParagraphElement = withCn(PlateElement, 'mb-4 p-0');

const plugins = createPlugins(
    [
        createDeserializeMdPlugin(),
        createBoldPlugin(),
        createItalicPlugin(),
        createSpoilerPlugin(),
        createParagraphPlugin(),
        createDiffPlugin(),
        createListPlugin(),
        /* createResetNodePlugin({
            options: {
                rules: [
                    {
                        types: [ELEMENT_SPOILER, ELEMENT_BLOCKQUOTE],
                        hotkey: 'Backspace',
                        predicate: isSelectionAtBlockStart,
                    },
                ],
            },
        }), */
        createExitBreakPlugin({
            options: {
                rules: [
                    {
                        hotkey: 'mod+enter',
                    },
                    {
                        hotkey: 'mod+shift+enter',
                        before: true,
                    },
                ],
            },
        }),
        createSoftBreakPlugin({
            options: {
                rules: [
                    { hotkey: 'shift+enter' },
                    {
                        hotkey: 'enter',
                        query: {
                            allow: [ELEMENT_SPOILER],
                        },
                    },
                ],
            },
        }),
        createLinkPlugin({
            renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,
        }),
    ],
    {
        components: {
            [MARK_ITALIC]: ItalicLeaf,
            [MARK_BOLD]: StrongLeaf,
            [ELEMENT_LINK]: LinkElement,
            [ELEMENT_SPOILER]: SpoilerElement,
            [ELEMENT_PARAGRAPH]: ParagraphElement,
        },
    },
);

export default plugins;

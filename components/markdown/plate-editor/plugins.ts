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
    RenderAfterEditable,
    createPlugins,
    isSelectionAtBlockStart,
} from '@udecode/plate-common';
import { ELEMENT_LINK, createLinkPlugin } from '@udecode/plate-link';
import { createParagraphPlugin } from '@udecode/plate-paragraph';
import { createResetNodePlugin } from '@udecode/plate-reset-node';

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

const plugins = createPlugins(
    [
        createDeserializeMdPlugin(),
        createBoldPlugin(),
        createItalicPlugin(),
        createSpoilerPlugin(),
        createParagraphPlugin(),
        createResetNodePlugin({
            options: {
                rules: [
                    {
                        types: [ELEMENT_SPOILER],
                        hotkey: 'Backspace',
                        predicate: isSelectionAtBlockStart,
                    },
                ],
            },
        }),
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
        },
    },
);

export default plugins;

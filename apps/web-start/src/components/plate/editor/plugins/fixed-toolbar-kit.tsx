'use client';

import { createPlatePlugin } from 'platejs/react';

import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import {
    FixedArticleToolbarButtons,
    FixedMarkdownToolbarButtons,
} from '@/components/plate/ui/fixed-toolbar-buttons';

export const FixedMarkdownToolbarKit = [
    createPlatePlugin({
        key: 'fixed-markdown-toolbar',
        render: {
            beforeEditable: () => (
                <FixedToolbar>
                    <FixedMarkdownToolbarButtons />
                </FixedToolbar>
            ),
        },
    }),
];

export const FixedArticleToolbarKit = [
    createPlatePlugin({
        key: 'fixed-article-toolbar',
        render: {
            beforeEditable: () => (
                <FixedToolbar variant="article">
                    <FixedArticleToolbarButtons />
                </FixedToolbar>
            ),
        },
    }),
];

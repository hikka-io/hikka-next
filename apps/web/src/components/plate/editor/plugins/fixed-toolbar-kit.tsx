'use client';

import { createPlatePlugin } from 'platejs/react';

import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import {
    FixedArticleToolbarButtons,
    FixedCommentToolbarButtons,
} from '@/components/plate/ui/fixed-toolbar-buttons';

export const FixedCommentToolbarKit = [
    createPlatePlugin({
        key: 'fixed-comment-toolbar',
        render: {
            beforeEditable: () => (
                <FixedToolbar>
                    <FixedCommentToolbarButtons />
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

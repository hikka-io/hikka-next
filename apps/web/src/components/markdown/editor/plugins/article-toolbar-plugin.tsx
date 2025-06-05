'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { ArticleToolbarButtons } from '../plate-ui/article-toolbar-buttons';
import { FixedToolbar } from '../plate-ui/fixed-toolbar';

export const ArticleToolbarPlugin = createPlatePlugin({
    key: 'fixed-toolbar',
    render: {
        beforeEditable: () => (
            <FixedToolbar>
                <ArticleToolbarButtons />
            </FixedToolbar>
        ),
    },
});

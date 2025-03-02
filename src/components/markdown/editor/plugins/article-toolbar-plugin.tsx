'use client';

import { createPlatePlugin } from '@udecode/plate-common/react';

import { ArticleToolbarButtons } from '@/components/markdown/editor/plate-ui/article-toolbar-buttons';
import { FixedToolbar } from '@/components/markdown/editor/plate-ui/fixed-toolbar';

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

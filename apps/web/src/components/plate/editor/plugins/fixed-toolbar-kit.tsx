import { createPlatePlugin } from 'platejs/react';

import { FixedArticleToolbarButtons } from '@/components/plate/ui/fixed-article-toolbar-buttons';
import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';

export const FixedArticleToolbarKit = [
    createPlatePlugin({
        key: 'fixed-article-toolbar',
        render: {
            beforeEditable: () => (
                <FixedToolbar variant="top">
                    <FixedArticleToolbarButtons />
                </FixedToolbar>
            ),
        },
    }),
];

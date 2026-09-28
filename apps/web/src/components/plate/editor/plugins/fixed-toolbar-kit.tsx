import { createPlatePlugin } from 'platejs/react';

import { FixedToolbar } from '@/components/plate/ui/fixed-toolbar';
import { FixedArticleToolbarButtons } from '@/components/plate/ui/fixed-toolbar-buttons';

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

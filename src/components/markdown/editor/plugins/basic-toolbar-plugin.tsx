'use client';

import { createPlatePlugin } from '@udecode/plate-common/react';

import { BasicToolbarButtons } from '@/components/markdown/editor/plate-ui/basic-toolbar-buttons';
import { FixedToolbar } from '@/components/markdown/editor/plate-ui/fixed-toolbar';

export const BasicToolbarPlugin = createPlatePlugin({
    key: 'fixed-toolbar',
    render: {
        beforeEditable: () => (
            <FixedToolbar>
                <BasicToolbarButtons />
            </FixedToolbar>
        ),
    },
});

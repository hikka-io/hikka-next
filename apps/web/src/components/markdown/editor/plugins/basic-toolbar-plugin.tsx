'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { BasicToolbarButtons } from '../plate-ui/basic-toolbar-buttons';
import { FixedToolbar } from '../plate-ui/fixed-toolbar';

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

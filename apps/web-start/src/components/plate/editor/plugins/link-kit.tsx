'use client';

import { LinkPlugin } from '@platejs/link/react';

import { LinkDialogProvider } from '@/components/plate/ui/link-dialog';
import { LinkElement } from '@/components/plate/ui/link-node';
import { LinkFloatingToolbar } from '@/components/plate/ui/link-toolbar';

function LinkAfterEditable() {
    return (
        <LinkDialogProvider>
            <LinkFloatingToolbar />
        </LinkDialogProvider>
    );
}

export const LinkKit = [
    LinkPlugin.configure({
        render: {
            node: LinkElement,
            afterEditable: LinkAfterEditable,
        },
    }),
];

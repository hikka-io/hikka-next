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
        options: {
            triggerFloatingLinkHotkeys: false as unknown as string,
        },
        render: {
            node: LinkElement,
            afterEditable: LinkAfterEditable,
        },
        shortcuts: {
            openLinkDialog: {
                keys: ['meta+k', 'ctrl+k'],
                handler: ({ editor }) => {
                    (editor as any)._linkDialog?.openInsert();
                },
                preventDefault: true,
            },
        },
    }),
];

import { LinkRules } from '@platejs/link';
import { LinkPlugin } from '@platejs/link/react';

import {
    getLinkDialog,
    LinkDialogProvider,
} from '@/components/plate/ui/link-dialog';
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
        inputRules: [
            LinkRules.autolink({ variant: 'paste' }),
            LinkRules.autolink({ variant: 'space' }),
            LinkRules.autolink({ variant: 'break' }),
            LinkRules.markdown(),
        ],
        options: {
            // Disable the built-in floating-link hotkeys — the custom
            // dialog below owns meta+k/ctrl+k.
            triggerFloatingLinkHotkeys: '',
        },
        render: {
            node: LinkElement,
            afterEditable: LinkAfterEditable,
        },
        shortcuts: {
            openLinkDialog: {
                keys: ['meta+k', 'ctrl+k'],
                handler: ({ editor }) => {
                    getLinkDialog(editor)?.openInsert();
                },
            },
        },
    }),
];

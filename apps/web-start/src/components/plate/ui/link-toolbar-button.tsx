'use client';

import { Link } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { LinkDialog, useLinkDialog } from './link-dialog';
import { ToolbarButton } from './toolbar';

export function LinkToolbarButton() {
    const editor = useEditorRef();
    const dialog = useLinkDialog(editor);

    return (
        <>
            <ToolbarButton
                onClick={dialog.openInsert}
                data-plate-focus
                tooltip="Посилання"
            >
                <Link />
            </ToolbarButton>
            <LinkDialog
                open={dialog.open}
                onOpenChange={dialog.onOpenChange}
                defaultValues={dialog.defaultValues}
                onSubmit={dialog.onSubmit}
            />
        </>
    );
}

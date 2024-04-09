import { LexicalCommand, createCommand } from 'lexical';
import React from 'react';
import { useForm } from 'react-hook-form';

import {
    activeEditor$,
    cancelLinkEdit$,
    editorRootElementRef$,
    iconComponentFor$,
    linkDialogState$,
    onWindowChange$,
    removeLink$,
    updateLink$,
} from '@mdxeditor/editor';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const OPEN_LINK_DIALOG: LexicalCommand<undefined> = createCommand();

interface LinkEditFormProps {
    url: string;
    title: string;
    onSubmit: (link: { url: string; title: string }) => void;
    onCancel: () => void;
    type: 'inactive' | 'preview' | 'edit';
}

interface LinkFormFields {
    url: string;
    title: string;
}

export function LinkEditForm({
    url,
    title,
    onSubmit,
    onCancel,
    type,
}: LinkEditFormProps) {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset: _,
    } = useForm<LinkFormFields>({
        values: {
            url,
            title,
        },
    });

    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
                e.stopPropagation();
                e.preventDefault();
            }}
            onReset={(e) => {
                e.stopPropagation();
                onCancel();
            }}
            className="flex flex-col gap-6"
        >
            {url.length === 0 && (
                <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="link-title">Назва</Label>
                    <Input id="link-title" size={40} {...register('title')} />
                </div>
            )}

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="link-url">URL</Label>
                <Input id="link-url" size={40} {...register('url')} />
            </div>

            <Button type="submit" title="Set URL" aria-label="Set URL">
                Зберегти
            </Button>
        </form>
    );
}

/** @internal */
export const LinkDialog: React.FC = () => {
    const [
        editorRootElementRef,
        activeEditor,
        iconComponentFor,
        linkDialogState,
    ] = useCellValues(
        editorRootElementRef$,
        activeEditor$,
        iconComponentFor$,
        linkDialogState$,
    );
    const updateLink = usePublisher(updateLink$);
    const cancelLinkEdit = usePublisher(cancelLinkEdit$);

    return (
        <Dialog
            onOpenChange={(open) => cancelLinkEdit()}
            open={linkDialogState.type === 'edit'}
        >
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                key={linkDialogState.linkNodeKey}
            >
                <DialogHeader>
                    <DialogTitle>Посилання</DialogTitle>
                </DialogHeader>
                {linkDialogState.type === 'edit' && (
                    <LinkEditForm
                        type={linkDialogState.type}
                        url={linkDialogState.url}
                        title={linkDialogState.title}
                        onSubmit={updateLink}
                        onCancel={cancelLinkEdit.bind(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

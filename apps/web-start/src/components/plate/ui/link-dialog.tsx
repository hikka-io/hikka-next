'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { upsertLink } from '@platejs/link';
import { type BaseRange, KEYS } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { useEditorRef } from 'platejs/react';
import React, {
    FC,
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';

import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    url: z.string().url(),
    text: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// --- Hook ---

interface LinkDialogState {
    open: boolean;
    defaultValues: FormValues;
}

export function useLinkDialog(editor: PlateEditor) {
    const [state, setState] = useState<LinkDialogState>({
        open: false,
        defaultValues: { url: '', text: '' },
    });
    const savedSelection = useRef<BaseRange | null>(null);

    const openInsert = useCallback(() => {
        savedSelection.current = editor.selection
            ? { ...editor.selection }
            : null;

        const selectedText =
            editor.selection && !editor.api.isCollapsed()
                ? editor.api.string(editor.selection)
                : '';

        setState({
            open: true,
            defaultValues: { url: '', text: selectedText },
        });
    }, [editor]);

    const openEdit = useCallback(() => {
        savedSelection.current = editor.selection
            ? { ...editor.selection }
            : null;

        const linkEntry = editor.api.node({
            match: { type: editor.getType(KEYS.link) },
        });

        if (!linkEntry) return;

        const [linkNode, linkPath] = linkEntry;
        const text = editor.api.string(linkPath);

        setState({
            open: true,
            defaultValues: {
                url: (linkNode as { url?: string }).url ?? '',
                text,
            },
        });
    }, [editor]);

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (savedSelection.current) {
                editor.tf.select(savedSelection.current);
            }

            upsertLink(editor, {
                url: values.url,
                text: values.text || undefined,
                skipValidation: true,
            });

            setState((prev) => ({ ...prev, open: false }));
            editor.tf.focus();
        },
        [editor],
    );

    const onOpenChange = useCallback(
        (open: boolean) => {
            setState((prev) => ({ ...prev, open }));

            if (!open) {
                if (savedSelection.current) {
                    editor.tf.select(savedSelection.current);
                }

                editor.tf.focus();
            }
        },
        [editor],
    );

    return {
        open: state.open,
        defaultValues: state.defaultValues,
        openInsert,
        openEdit,
        onSubmit,
        onOpenChange,
    };
}

// --- Dialog ---

type LinkDialogFormProps = {
    defaultValues: FormValues;
    onSubmit: (values: FormValues) => void;
    onClose: () => void;
};

const LinkDialogForm: FC<LinkDialogFormProps> = ({
    defaultValues,
    onSubmit,
    onClose,
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <div className="flex w-full flex-col gap-6">
                <FormInput
                    name="url"
                    label="Посилання"
                    placeholder="https://example.com"
                />
                <FormInput
                    name="text"
                    label="Текст відображення"
                    placeholder="Введіть текст"
                />
            </div>
            <ResponsiveModalFooter>
                <Button
                    onClick={onClose}
                    type="button"
                    variant="outline"
                    size="md"
                >
                    Скасувати
                </Button>
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    type="submit"
                    size="md"
                >
                    Прийняти
                </Button>
            </ResponsiveModalFooter>
        </Form>
    );
};

// --- Dialog ---

type LinkDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultValues: FormValues;
    onSubmit: (values: FormValues) => void;
};

export function LinkDialog({
    open,
    onOpenChange,
    defaultValues,
    onSubmit,
}: LinkDialogProps) {
    return (
        <ResponsiveModal open={open} onOpenChange={onOpenChange}>
            <ResponsiveModalContent className="md:max-w-md" title="Посилання">
                <LinkDialogForm
                    key={open ? 'open' : 'closed'}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    onClose={() => onOpenChange(false)}
                />
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
}

// --- Context ---

interface LinkDialogContextValue {
    openInsert: () => void;
    openEdit: () => void;
}

const LinkDialogContext = createContext<LinkDialogContextValue | null>(null);

export function useLinkDialogContext() {
    const ctx = useContext(LinkDialogContext);
    if (!ctx) {
        throw new Error(
            'useLinkDialogContext must be used within LinkDialogProvider',
        );
    }
    return ctx;
}

// --- Provider (renders dialog + provides context) ---

export function LinkDialogProvider({
    children,
}: {
    children?: React.ReactNode;
}) {
    const editor = useEditorRef();
    const dialog = useLinkDialog(editor);

    return (
        <LinkDialogContext.Provider
            value={{ openInsert: dialog.openInsert, openEdit: dialog.openEdit }}
        >
            {children}
            <LinkDialog
                open={dialog.open}
                onOpenChange={dialog.onOpenChange}
                defaultValues={dialog.defaultValues}
                onSubmit={dialog.onSubmit}
            />
        </LinkDialogContext.Provider>
    );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Film } from 'lucide-react';
import { useEditorRef } from 'platejs/react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import { VideoPlugin } from '@/components/plate/editor/plugins/video-kit';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';

import { z } from '@/utils/i18n/zod';

import { ToolbarButton } from './toolbar';

const urlSchema = z
    .string()
    .url()
    .refine(
        (url) => {
            try {
                const parsedUrl = new URL(url);
                return (
                    parsedUrl.hostname.includes('youtube.com') ||
                    parsedUrl.hostname.includes('youtu.be')
                );
            } catch {
                return false;
            }
        },
        {
            message: 'Невірне посилання на YouTube',
        },
    );

const formSchema = z.object({
    url: urlSchema,
});

type AddVideoModalProps = {
    editor: ReturnType<typeof useEditorRef>;
    onClose: () => void;
};

const AddVideoModal: FC<AddVideoModalProps> = ({ editor, onClose }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const handleInsertVideo = (data: z.infer<typeof formSchema>) => {
        if (!data.url.trim()) return;

        editor
            .getTransforms(VideoPlugin)
            .insert.video({ url: data.url.trim() });
        editor.tf.focus();

        onClose();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-6">
                    <FormInput
                        name="url"
                        label="Посилання на відео"
                        placeholder="Введіть посилання"
                        className="flex-1"
                        description="Підтримуються посилання на YouTube"
                    />
                </div>
                <div className="flex w-full justify-end gap-2">
                    <Button
                        onClick={onClose}
                        type="button"
                        variant="outline"
                        size="md"
                    >
                        Скасувати
                    </Button>
                    <Button
                        onClick={form.handleSubmit(handleInsertVideo)}
                        variant="secondary"
                        type="submit"
                        size="md"
                    >
                        Прийняти
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export function VideoToolbarButton() {
    const editor = useEditorRef();
    const [open, setOpen] = useState(false);

    return (
        <>
            <ToolbarButton
                onClick={() => setOpen(true)}
                tooltip="Відео"
                className="relative"
            >
                <Film className="size-4" />
            </ToolbarButton>
            <ResponsiveModal open={open} onOpenChange={setOpen} forceDesktop>
                <ResponsiveModalContent
                    className="md:max-w-xl"
                    title="Додати відео"
                >
                    <AddVideoModal
                        editor={editor}
                        onClose={() => setOpen(false)}
                    />
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    );
}

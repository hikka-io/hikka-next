'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEditorRef } from '@udecode/plate/react';
import { Film } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { useModalContext } from '../../../../services/providers/modal-provider';
import { z } from '../../../../utils/zod';
import FormInput from '../../../form/form-input';
import { Button } from '../../../ui/button';
import { Form } from '../../../ui/form';
import { insertVideo } from '../plugins/video-plugin/transforms/insert-video';
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
};

const AddVideoModal: FC<AddVideoModalProps> = ({ editor }) => {
    const { closeModal } = useModalContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        insertVideo(editor, data.url);
        closeModal();
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
                <div className="grid w-full grid-cols-2 gap-8">
                    <Button
                        onClick={closeModal}
                        type="button"
                        variant="outline"
                    >
                        Скасувати
                    </Button>
                    <Button
                        onClick={form.handleSubmit(handleSubmit)}
                        variant="secondary"
                        type="submit"
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
    const { openModal } = useModalContext();

    const openAddVideoModal = () => {
        openModal({
            content: <AddVideoModal editor={editor} />,
            className: '!max-w-xl',
            title: 'Додати відео',
            forceModal: true,
        });
    };

    return (
        <ToolbarButton
            onClick={openAddVideoModal}
            tooltip="Відео"
            className="relative"
        >
            <Film className="size-4" />
        </ToolbarButton>
    );
}

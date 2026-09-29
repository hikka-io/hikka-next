import { type FC, useState } from 'react';

import { Film } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { useAppForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalFooter,
} from '@/components/ui/responsive-modal';
import { z } from '@/utils/i18n/zod';
import { isYouTubeVideoUrl, normalizeYouTubeVideoUrl } from '@/utils/youtube';

import { VideoPlugin } from '../editor/plugins/video-kit';
import { ToolbarButton } from './toolbar';

const urlSchema = z.string().url().refine(isYouTubeVideoUrl, {
    message: 'Невірне посилання на YouTube',
});

const formSchema = z.object({
    url: urlSchema,
});

type AddVideoModalProps = {
    editor: ReturnType<typeof useEditorRef>;
    onClose: () => void;
};

const AddVideoModal: FC<AddVideoModalProps> = ({ editor, onClose }) => {
    const form = useAppForm({
        defaultValues: {
            url: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            const url = normalizeYouTubeVideoUrl(value.url);

            if (!url) return;

            editor.getTransforms(VideoPlugin).insert.video({ url });
            editor.tf.focus();

            onClose();
        },
    });

    return (
        <form.AppForm>
            <form.Form className="contents">
                <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-auto p-4">
                    <form.AppField
                        name="url"
                        children={(field) => (
                            <field.TextField
                                label="Посилання на відео"
                                placeholder="Введіть посилання"
                                className="flex-1"
                                description="Підтримуються посилання на YouTube"
                            />
                        )}
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
                    <Button type="submit" size="md">
                        Прийняти
                    </Button>
                </ResponsiveModalFooter>
            </form.Form>
        </form.AppForm>
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
            <ResponsiveModal open={open} onOpenChange={setOpen} mobile="page">
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

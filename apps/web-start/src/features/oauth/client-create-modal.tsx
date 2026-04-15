'use client';

import { useCreateClient } from '@hikka/react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';

import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    name: z.coerce.string().min(3).max(128),
    description: z.coerce.string().min(3).max(512),
    endpoint: z.coerce.string().min(3).max(128),
});

interface Props {
    onClose?: () => void;
}

const Component = ({ onClose }: Props) => {
    const { mutate: createClient, isPending: createClientLoading } =
        useCreateClient({
            options: {
                onSuccess: () => {
                    toast.success('Застосунок успішно створено.');
                    onClose?.();
                },
            },
        });

    const form = useAppForm({
        defaultValues: {
            name: '',
            description: '',
            endpoint: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            createClient({ ...value });
        },
    });

    return (
        <form
            className="contents"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
                <form.AppField
                    name="name"
                    children={(field) => (
                        <field.TextField
                            label="Назва застосунку"
                            placeholder="Введіть назву застосунку"
                            type="string"
                        />
                    )}
                />
                <form.AppField
                    name="description"
                    children={(field) => (
                        <field.TextareaField
                            label="Опис"
                            placeholder="Залиште опис до застосунку"
                        />
                    )}
                />
                <form.AppField
                    name="endpoint"
                    children={(field) => (
                        <field.TextField
                            label="Посилання переспрямування"
                            placeholder="https://example.com/"
                            type="string"
                        />
                    )}
                />
            </div>
            <ResponsiveModalFooter>
                <Button
                    variant="default"
                    size="md"
                    type="submit"
                >
                    {createClientLoading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Створити
                </Button>
            </ResponsiveModalFooter>
        </form>
    );
};

export default Component;

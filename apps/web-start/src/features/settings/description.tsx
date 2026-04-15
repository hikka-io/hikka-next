'use client';

import { useChangeDescription, useSession } from '@hikka/react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';

import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    description: z.string().max(140).nullable(),
});

const Component = () => {
    const { user: loggedUser } = useSession();

    const mutationChangeDescription = useChangeDescription({
        options: {
            onSuccess: async () => {
                toast.success(
                    'Ви успішно змінили загальні налаштування профілю.',
                );
            },
        },
    });

    const form = useAppForm({
        defaultValues: {
            description: loggedUser?.description ?? null,
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangeDescription.mutate({
                description: value.description,
            });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col items-start gap-6"
        >
            <form.AppField
                name="description"
                children={(field) => (
                    <field.TextareaField
                        placeholder="Введіть опис"
                        label="Опис"
                        className="w-full"
                    />
                )}
            />
            <Button
                size="md"
                disabled={mutationChangeDescription.isPending}
                variant="default"
                type="submit"
            >
                {mutationChangeDescription.isPending && (
                    <span className="loading loading-spinner"></span>
                )}
                Зберегти
            </Button>
        </form>
    );
};

export default Component;

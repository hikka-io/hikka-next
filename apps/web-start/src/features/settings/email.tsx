'use client';

import { useChangeEmail } from '@hikka/react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';

import { z } from '@/utils/i18n/zod';

const formSchema = z
    .object({
        email: z.string().email(),
        emailConfirmation: z.string().email(),
    })
    .refine((data) => data.email === data.emailConfirmation, {
        message: 'Пошти не збігаються',
        path: ['emailConfirmation'],
    });

const Component = () => {
    const mutationChangeEmail = useChangeEmail({
        options: {
            onSuccess: async () => {
                toast.success('Ви успішно змінили поштову адресу.');
            },
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: '',
            emailConfirmation: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangeEmail.mutate({
                email: value.email,
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
                name="email"
                children={(field) => (
                    <field.TextField
                        type="email"
                        label="Новий email"
                        placeholder="Введіть новий email"
                        className="w-full"
                    />
                )}
            />
            <form.AppField
                name="emailConfirmation"
                children={(field) => (
                    <field.TextField
                        type="email"
                        label="Підтвердити email"
                        placeholder="Підтвердіть новий email"
                        className="w-full"
                    />
                )}
            />
            <Button
                size="md"
                disabled={mutationChangeEmail.isPending}
                variant="default"
                type="submit"
            >
                {mutationChangeEmail.isPending && (
                    <span className="loading loading-spinner"></span>
                )}
                Зберегти
            </Button>
        </form>
    );
};

export default Component;

'use client';

import { useChangePassword } from '@hikka/react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';

import { z } from '@/utils/i18n/zod';

const formSchema = z
    .object({
        password: z.string().min(6),
        passwordConfirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const Component = () => {
    const mutationChangePassword = useChangePassword({
        options: {
            onSuccess: async () => {
                toast.success('Ви успішно змінили пароль.');
            },
        },
    });

    const form = useAppForm({
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangePassword.mutate({
                password: value.password,
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
                name="password"
                children={(field) => (
                    <field.TextField
                        type="password"
                        placeholder="Введіть новий пароль"
                        label="Новий пароль"
                        className="w-full"
                    />
                )}
            />
            <form.AppField
                name="passwordConfirmation"
                children={(field) => (
                    <field.TextField
                        type="password"
                        placeholder="Підтвердіть новий пароль"
                        label="Підтвердити пароль"
                        className="w-full"
                    />
                )}
            />
            <Button
                size="md"
                disabled={mutationChangePassword.isPending}
                variant="default"
                type="submit"
            >
                {mutationChangePassword.isPending && (
                    <span className="loading loading-spinner"></span>
                )}
                Зберегти
            </Button>
        </form>
    );
};

export default Component;

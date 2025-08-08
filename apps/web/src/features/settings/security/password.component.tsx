'use client';

import { useChangePassword } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

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
    const { closeModal } = useModalContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutationChangePassword = useChangePassword({
        options: {
            onSuccess: async () => {
                closeModal();
                toast.success('Ви успішно змінили пароль.');
            },
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutationChangePassword.mutate({
            password: data.password,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col items-start gap-6"
            >
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Введіть новий пароль"
                    label="Новий пароль"
                    className="w-full"
                />
                <FormInput
                    name="passwordConfirmation"
                    type="password"
                    placeholder="Підтвердіть новий пароль"
                    label="Підтвердити пароль"
                    className="w-full"
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
        </Form>
    );
};

export default Component;

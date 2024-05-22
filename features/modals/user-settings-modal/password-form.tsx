'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import changeUserPassword from '@/services/api/settings/changeUserPassword';
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
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutation = useMutation({
        mutationFn: changeUserPassword,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            closeModal();
            enqueueSnackbar('Ви успішно змінили пароль.', {
                variant: 'success',
            });
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate({
            params: data,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col gap-6 p-6"
            >
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Введіть новий пароль"
                    label="Новий пароль"
                />
                <FormInput
                    name="passwordConfirmation"
                    type="password"
                    placeholder="Підтвердіть новий пароль"
                    label="Підтвердити пароль"
                />
                <Button
                    disabled={mutation.isPending}
                    variant="default"
                    type="submit"
                    className="w-full"
                >
                    {mutation.isPending && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </Button>
            </form>
        </Form>
    );
};

export default Component;

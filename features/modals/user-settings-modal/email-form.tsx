'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import changeUserEmail from '@/services/api/settings/changeUserEmail';
import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

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
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutation = useMutation({
        mutationFn: changeUserEmail,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            closeModal();
            enqueueSnackbar('Ви успішно змінили поштову адресу.', {
                variant: 'success',
            });
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate({
            params: {
                email: data.email,
            },
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col gap-6 p-6"
            >
                <FormInput
                    name="email"
                    type="email"
                    label="Новий email"
                    placeholder="Введіть новий email"
                />
                <FormInput
                    name="emailConfirmation"
                    type="email"
                    label="Підтвердити email"
                    placeholder="Підтвердіть новий email"
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

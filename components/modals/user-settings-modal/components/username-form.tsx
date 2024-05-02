'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import changeUserUsername from '@/services/api/settings/changeUserUsername';
import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

const formSchema = z.object({
    username: z.string().min(2).max(50),
});

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutation = useMutation({
        mutationFn: changeUserUsername,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            router.push('/u/' + form.getValues().username);
            closeModal();
            enqueueSnackbar('Ви успішно змінили імʼя користвача.', {
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
                    name="username"
                    type="text"
                    label="Нове ім’я користувача"
                    placeholder="Введіть нове імʼя"
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

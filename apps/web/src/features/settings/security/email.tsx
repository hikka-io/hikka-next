'use client';

import { useChangeEmail } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
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
    const { closeModal } = useModalContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutationChangeEmail = useChangeEmail({
        options: {
            onSuccess: async () => {
                closeModal();
                toast.success('Ви успішно змінили поштову адресу.');
            },
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutationChangeEmail.mutate({
            email: data.email,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col items-start gap-6"
            >
                <FormInput
                    name="email"
                    type="email"
                    label="Новий email"
                    placeholder="Введіть новий email"
                    className="w-full"
                />
                <FormInput
                    name="emailConfirmation"
                    type="email"
                    label="Підтвердити email"
                    placeholder="Підтвердіть новий email"
                    className="w-full"
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
        </Form>
    );
};

export default Component;

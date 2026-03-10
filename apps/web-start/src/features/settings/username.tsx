'use client';

import { useChangeUsername } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    username: z.string().min(2).max(50),
});

const Component = () => {
    const { closeModal } = useModalContext();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutationChangeUsername = useChangeUsername({
        options: {
            onSuccess: async () => {
                router.push('/u/' + form.getValues().username);
                closeModal();
                toast.success('Ви успішно змінили імʼя користвача.');
            },
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutationChangeUsername.mutate({
            username: data.username,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col items-start gap-6"
            >
                <FormInput
                    name="username"
                    type="text"
                    label="Нове ім’я користувача"
                    placeholder="Введіть нове імʼя"
                    className="w-full"
                />
                <Button
                    size="md"
                    disabled={mutationChangeUsername.isPending}
                    variant="default"
                    type="submit"
                >
                    {mutationChangeUsername.isPending && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </Button>
            </form>
        </Form>
    );
};

export default Component;

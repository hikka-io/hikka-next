'use client';

import { useCreateClient } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormInput from '@/components/form/form-input';
import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    name: z.coerce.string().min(3).max(128),
    description: z.coerce.string().min(3).max(512),
    endpoint: z.coerce.string().min(3).max(128),
});

const Component = () => {
    const { closeModal } = useModalContext();

    const { mutate: createClient, isPending: createClientLoading } =
        useCreateClient({
            options: {
                onSuccess: () => {
                    toast.success('Застосунок успішно створено.');
                    closeModal();
                },
            },
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onCreate = async (formData: z.infer<typeof formSchema>) => {
        createClient({ ...formData });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-6">
                    <FormInput
                        name="name"
                        label="Назва застосунку"
                        placeholder="Введіть назву застосунку"
                        type="string"
                    />
                    <FormTextarea
                        name="description"
                        label="Опис"
                        placeholder="Залиште опис до застосунку"
                    />
                    <FormInput
                        name="endpoint"
                        label="Посилання переспрямування"
                        placeholder="https://example.com/"
                        type="string"
                    />
                    <Button
                        variant="default"
                        onClick={form.handleSubmit(onCreate)}
                        className="w-full"
                        type="submit"
                    >
                        {createClientLoading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Створити
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Component;

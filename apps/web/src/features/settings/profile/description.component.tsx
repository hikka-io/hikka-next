'use client';

import { useChangeDescription, useSession } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
import { z } from '@/utils/zod';

const formSchema = z.object({
    description: z.string().max(140).nullable(),
});

const Component = () => {
    const { closeModal } = useModalContext();

    const { user: loggedUser } = useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: loggedUser?.description,
        },
    });

    const mutationChangeDescription = useChangeDescription({
        options: {
            onSuccess: async () => {
                closeModal();
                toast.success(
                    'Ви успішно змінили загальні налаштування профілю.',
                );
            },
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutationChangeDescription.mutate({
            description: data.description,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col items-start gap-6"
            >
                <FormTextarea
                    name="description"
                    placeholder="Введіть опис"
                    label="Опис"
                    className="w-full"
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
        </Form>
    );
};

export default Component;

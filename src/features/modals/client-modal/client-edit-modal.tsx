'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import FormInput from '@/components/form/form-input';
import FormTextarea from '@/components/form/form-textarea';
import FormSwitch from '@/components/form/form-switch';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import MaterialSymbolsContentCopy from '~icons/material-symbols/content-copy';

import useClientInfo from '@/services/hooks/client/use-client-info';
import useUpdateClient from '@/services/hooks/client/use-update-client';
import useDeleteClient from '@/services/hooks/client/use-delete-client';
import { useModalContext } from '@/services/providers/modal-provider';

import { z } from '@/utils/zod';


const formSchema = z.object({
    name: z.coerce.string().min(3).max(128),
    description: z.coerce.string().min(3).max(512),
    endpoint: z.coerce.string().min(3).max(128),
    revoke_secret: z.coerce.boolean(),
    secret: z.coerce.string().min(128).max(128),
});

interface Props {
    client_reference: string;
}

const Component = ({ client_reference }: Props) => {
    const { closeModal } = useModalContext();
    const { mutate: updateClient, isPending: updateClientLoading } = useUpdateClient();
    const { mutate: deleteClient, isPending: deleteClientLoading } = useDeleteClient();
    const { data, isLoading: clientInfoLoading, refetch } = useClientInfo({ client_reference });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            revoke_secret: false,
        }
    });

    useEffect(() => {
        if (data) {
            form.reset({
                revoke_secret: false,
                ...data
            });
        }
    }, [data, form]);

    const onDelete = async () => {
        deleteClient({ params: { client_reference } });
        closeModal();
    };

    const onUpdate = async (formData: z.infer<typeof formSchema>) => {
        updateClient(
            {
                params: {
                    client_reference: client_reference,
                    ...formData
                }
            },
            {
                onSuccess: () => {
                    refetch();
                    closeModal();
                }
            }
        );
    };

    const onCopy = async (formData: z.infer<typeof formSchema>) => {
        navigator.clipboard.writeText(formData.secret);
    };

    if (!data) return null;

    return (
        <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 w-full">
                    <FormInput
                        name="name"
                        label="Назва додатка"
                        placeholder="Введіть назву застосунка"
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
                    <div>
                        <FormLabel>Секрет</FormLabel>
                        <div className="flex items-end gap-2 w-full">
                            <FormInput
                                name="secret"
                                placeholder="h1Kk@--H3l1o1tsl0rgoN- ..."
                                disabled
                                type="password"
                                className="w-full"
                            />
                            <Button 
                                variant="secondary"
                                onClick={form.handleSubmit(onCopy)}
                            >
                                <MaterialSymbolsContentCopy />
                                Скопіювати
                            </Button>
                        </div>
                    </div>
                    <FormSwitch
                        name="revoke_secret"
                        label="Перестворити секрет"
                        className="w-full"
                    />
                    <div className="grid grid-cols-2 gap-8 w-full">
                        <Button
                            variant="accent"
                            onClick={form.handleSubmit(onUpdate)}
                            type="submit"
                        >
                            {(updateClientLoading) && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Оновити
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onDelete}
                        >
                            {(deleteClientLoading) && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Видалити
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default Component;

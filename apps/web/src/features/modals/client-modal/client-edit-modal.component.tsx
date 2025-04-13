'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import FormSwitch from '@/components/form/form-switch';
import FormTextarea from '@/components/form/form-textarea';
import MaterialSymbolsContentCopy from '@/components/icons/material-symbols/MaterialSymbolsContentCopy';
import { Button } from '@/components/ui/button';
import { Form, FormLabel } from '@/components/ui/form';
import useClientInfo from '@/services/hooks/client/use-client-info';
import useDeleteClient from '@/services/hooks/client/use-delete-client';
import useUpdateClient from '@/services/hooks/client/use-update-client';
import { z } from '@/utils/zod';

const formSchema = z.object({
    name: z.coerce.string().min(3).max(128),
    description: z.coerce.string().min(3).max(512),
    endpoint: z.coerce.string().min(3).max(128),
    revoke_secret: z.coerce.boolean(),
    client_reference: z.coerce.string().max(128),
    secret: z.coerce.string().min(128).max(128),
});

interface Props {
    client: API.Client;
}

const Component = ({ client }: Props) => {
    const { mutate: updateClient, isPending: updateClientLoading } =
        useUpdateClient();
    const { mutate: deleteClient, isPending: deleteClientLoading } =
        useDeleteClient();
    const { data } = useClientInfo({ client_reference: client.reference });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            revoke_secret: false,
            client_reference: client.reference,
            ...client,
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                revoke_secret: false,
                ...data,
            });
        }
    }, [data, form]);

    const onDelete = async () => {
        deleteClient({ params: { client_reference: client.reference } });
    };

    const onUpdate = async (formData: z.infer<typeof formSchema>) => {
        updateClient({
            params: {
                ...formData,
            },
        });
    };

    const onCopy = async (
        formData: z.infer<typeof formSchema>,
        field: 'client_reference' | 'secret',
    ) => {
        navigator.clipboard.writeText(formData[field]);
        enqueueSnackbar('Ви успішно скопіювали рядок.', {
            variant: 'success',
        });
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
                    <div>
                        <FormLabel>Референс</FormLabel>
                        <div className="flex w-full items-end gap-2">
                            <FormInput
                                name="client_reference"
                                placeholder="123123-123123-123123-123123"
                                disabled
                                className="w-full"
                            />
                            <Button
                                variant="outline"
                                onClick={form.handleSubmit((data) =>
                                    onCopy(data, 'client_reference'),
                                )}
                            >
                                <MaterialSymbolsContentCopy />
                                Скопіювати
                            </Button>
                        </div>
                    </div>
                    <div>
                        <FormLabel>Ключ</FormLabel>
                        <div className="flex w-full items-end gap-2">
                            <FormInput
                                name="secret"
                                placeholder="h1Kk@--H3l1o1tsl0rgoN- ..."
                                disabled
                                type="password"
                                className="w-full"
                            />
                            <Button
                                variant="outline"
                                onClick={form.handleSubmit((data) =>
                                    onCopy(data, 'secret'),
                                )}
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
                    <div className="grid w-full grid-cols-2 gap-8">
                        <Button
                            variant="secondary"
                            onClick={form.handleSubmit(onUpdate)}
                            type="submit"
                            disabled={
                                deleteClientLoading || updateClientLoading
                            }
                        >
                            {updateClientLoading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Оновити
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onDelete}
                            disabled={
                                deleteClientLoading || updateClientLoading
                            }
                        >
                            {deleteClientLoading && (
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

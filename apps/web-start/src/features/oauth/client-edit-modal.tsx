'use client';

import { ClientResponse } from '@hikka/client';
import {
    useClientFullDetails,
    useDeleteClient,
    useUpdateClient,
} from '@hikka/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import MaterialSymbolsContentCopy from '@/components/icons/material-symbols/MaterialSymbolsContentCopy';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';

import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    name: z.coerce.string().min(3).max(128),
    description: z.coerce.string().min(3).max(512),
    endpoint: z.coerce.string().min(3).max(128),
    revoke_secret: z.coerce.boolean(),
    reference: z.coerce.string().max(128),
    secret: z.coerce.string().min(128).max(128),
});

interface Props {
    client: ClientResponse;
    onClose?: () => void;
}

const Component = ({ client, onClose }: Props) => {
    const { mutate: updateClient, isPending: updateClientLoading } =
        useUpdateClient({
            options: {
                onSuccess: () => {
                    toast.success('Застосунок успішно оновлено');
                    onClose?.();
                },
            },
        });
    const { mutate: deleteClient, isPending: deleteClientLoading } =
        useDeleteClient({
            options: {
                onSuccess: () => {
                    toast.success('Застосунок успішно видалено');
                    onClose?.();
                },
            },
        });
    const { data } = useClientFullDetails({ reference: client.reference });

    const form = useAppForm({
        defaultValues: {
            name: client.name,
            description: client.description,
            endpoint: '',
            reference: client.reference,
            secret: '',
            revoke_secret: false,
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            const { reference, secret, ...rest } = value;
            updateClient({
                reference,
                args: {
                    ...rest,
                },
            });
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                description: data.description,
                endpoint: data.endpoint,
                reference: data.reference,
                secret: data.secret,
                revoke_secret: false,
            });
        }
    }, [data, form]);

    const onDelete = async () => {
        deleteClient(client.reference);
    };

    const onCopy = async (field: 'reference' | 'secret') => {
        navigator.clipboard.writeText(form.getFieldValue(field));
        toast.success('Ви успішно скопіювали рядок.');
    };

    return (
        <form
            className="contents"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
                <form.AppField
                    name="name"
                    children={(field) => (
                        <field.TextField
                            label="Назва застосунку"
                            placeholder="Введіть назву застосунку"
                            type="string"
                        />
                    )}
                />
                <form.AppField
                    name="description"
                    children={(field) => (
                        <field.TextareaField
                            label="Опис"
                            placeholder="Залиште опис до застосунку"
                        />
                    )}
                />
                <form.AppField
                    name="endpoint"
                    children={(field) => (
                        <field.TextField
                            label="Посилання переспрямування"
                            placeholder="https://example.com/"
                            type="string"
                        />
                    )}
                />
                <div>
                    <Label>Референс</Label>
                    <div className="flex w-full items-end gap-2">
                        <form.AppField
                            name="reference"
                            children={(field) => (
                                <field.TextField
                                    placeholder="123123-123123-123123-123123"
                                    disabled
                                    className="w-full"
                                />
                            )}
                        />
                        <Button
                            variant="outline"
                            onClick={() => onCopy('reference')}
                        >
                            <MaterialSymbolsContentCopy />
                            Скопіювати
                        </Button>
                    </div>
                </div>
                <div>
                    <Label>Ключ</Label>
                    <div className="flex w-full items-end gap-2">
                        <form.AppField
                            name="secret"
                            children={(field) => (
                                <field.TextField
                                    placeholder="h1Kk@--H3l1o1tsl0rgoN- ..."
                                    disabled
                                    type="password"
                                    className="w-full"
                                />
                            )}
                        />
                        <Button
                            variant="outline"
                            onClick={() => onCopy('secret')}
                        >
                            <MaterialSymbolsContentCopy />
                            Скопіювати
                        </Button>
                    </div>
                </div>
                <form.AppField
                    name="revoke_secret"
                    children={(field) => (
                        <field.SwitchField
                            label="Перестворити секрет"
                            className="w-full"
                        />
                    )}
                />
            </div>
            <ResponsiveModalFooter>
                <Button
                    size="md"
                    variant="secondary"
                    type="submit"
                    disabled={deleteClientLoading || updateClientLoading}
                >
                    {updateClientLoading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Оновити
                </Button>
                <Button
                    size="md"
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                    disabled={deleteClientLoading || updateClientLoading}
                >
                    {deleteClientLoading && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Видалити
                </Button>
            </ResponsiveModalFooter>
        </form>
    );
};

export default Component;

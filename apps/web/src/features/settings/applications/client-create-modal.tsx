import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createUserClientMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import Spinner from '@/components/ui/spinner';
import { invalidateUserClients } from '@/utils/api/invalidate-content-state';
import {
    clientDescriptionSchema,
    clientNameSchema,
    endpointSchema,
} from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    name: clientNameSchema,
    description: clientDescriptionSchema,
    endpoint: endpointSchema,
});

type Props = {
    onClose?: () => void;
};

const ClientCreateModal = ({ onClose }: Props) => {
    const queryClient = useQueryClient();

    const { mutate: createClient, isPending: createClientLoading } =
        useMutation({
            ...createUserClientMutation(),
            onSuccess: () => {
                invalidateUserClients(queryClient);
                toast.success('Застосунок успішно створено.');
                onClose?.();
            },
        });

    const form = useAppForm({
        defaultValues: {
            name: '',
            description: '',
            endpoint: '',
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            createClient({ body: value });
        },
    });

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
                            description="Сюди Hikka поверне користувача після входу: повна адреса зі схемою — https://… або власна схема застосунку, як myapp://auth"
                            type="text"
                            inputMode="url"
                            autoCapitalize="none"
                            spellCheck={false}
                        />
                    )}
                />
            </div>
            <ResponsiveModalFooter>
                <Button variant="default" size="md" type="submit">
                    {createClientLoading && <Spinner />}
                    Створити
                </Button>
            </ResponsiveModalFooter>
        </form>
    );
};

export default ClientCreateModal;

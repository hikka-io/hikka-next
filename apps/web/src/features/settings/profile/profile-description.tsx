import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_LIMITS, changeDescriptionMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { useSession } from '@/services/session';
import { invalidateSession } from '@/utils/api/invalidate-content-state';
import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    description: z.string().max(API_LIMITS.profileDescription.max).nullable(),
});

const ProfileDescription = () => {
    const { user: loggedUser } = useSession();
    const queryClient = useQueryClient();

    const mutationChangeDescription = useMutation({
        ...changeDescriptionMutation(),
        onSuccess: async () => {
            invalidateSession(queryClient);
            toast.success('Ви успішно змінили загальні налаштування профілю.');
        },
    });

    const form = useAppForm({
        defaultValues: {
            description: loggedUser?.description ?? null,
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangeDescription.mutate({
                body: { description: value.description },
            });
        },
    });

    return (
        <form.AppForm>
            <form.Form className="flex flex-col items-start gap-6">
                <form.AppField
                    name="description"
                    children={(field) => (
                        <field.TextareaField
                            placeholder="Введіть опис"
                            label="Опис"
                            className="w-full"
                        />
                    )}
                />
                <SubmitButton
                    size="md"
                    loading={mutationChangeDescription.isPending}
                    variant="default"
                >
                    Зберегти
                </SubmitButton>
            </form.Form>
        </form.AppForm>
    );
};

export default ProfileDescription;

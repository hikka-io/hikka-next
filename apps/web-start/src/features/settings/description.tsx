import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { changeDescriptionMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { useSession } from '@/features/auth/hooks/use-session';
import { z } from '@/utils/i18n/zod';

const formSchema = z.object({
    description: z.string().max(140).nullable(),
});

const ProfileDescription = () => {
    const { user: loggedUser } = useSession();

    const mutationChangeDescription = useMutation({
        ...changeDescriptionMutation(),
        onSuccess: async () => {
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
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col items-start gap-6"
        >
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
            <Button
                size="md"
                disabled={mutationChangeDescription.isPending}
                variant="default"
                type="submit"
            >
                {mutationChangeDescription.isPending && <Spinner />}
                Зберегти
            </Button>
        </form>
    );
};

export default ProfileDescription;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { changeUsernameMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { invalidateSession } from '@/utils/api/invalidate-content-state';
import { USERNAME_HINT, usernameSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { useRouter } from '@/utils/navigation';

const formSchema = z.object({
    username: usernameSchema,
});

const ProfileUsername = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutationChangeUsername = useMutation({
        ...changeUsernameMutation(),
        onSuccess: async () => {
            invalidateSession(queryClient);
            router.push(`/u/${form.getFieldValue('username')}`);
            toast.success("Ви успішно змінили ім'я користувача.");
        },
    });

    const form = useAppForm({
        defaultValues: {
            username: '',
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangeUsername.mutate({
                body: { username: value.username },
            });
        },
    });

    return (
        <form.AppForm>
            <form.Form className="flex flex-col items-start gap-6">
                <form.AppField
                    name="username"
                    children={(field) => (
                        <field.TextField
                            type="text"
                            label="Нове ім'я користувача"
                            placeholder="Введіть новий нікнейм"
                            description={USERNAME_HINT}
                            autoComplete="username"
                            autoCapitalize="none"
                            spellCheck={false}
                            className="w-full"
                        />
                    )}
                />
                <SubmitButton
                    size="md"
                    variant="default"
                    loading={mutationChangeUsername.isPending}
                >
                    Зберегти
                </SubmitButton>
            </form.Form>
        </form.AppForm>
    );
};

export default ProfileUsername;

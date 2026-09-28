import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHydrated } from '@tanstack/react-router';
import { toast } from 'sonner';

import { changeUsernameMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { invalidateSession } from '@/utils/api/invalidate-content-state';
import { usernameSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { useRouter } from '@/utils/navigation';

const formSchema = z.object({
    username: usernameSchema,
});

const ProfileUsername = () => {
    // Until hydration the form is plain HTML: a click would submit it
    // natively (GET, reload, fields in the address bar), so wait for React.
    const hydrated = useHydrated();
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutationChangeUsername = useMutation({
        ...changeUsernameMutation(),
        onSuccess: async () => {
            invalidateSession(queryClient);
            router.push(`/u/${form.getFieldValue('username')}`);
            toast.success('Ви успішно змінили імʼя користвача.');
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
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col items-start gap-6"
        >
            <form.AppField
                name="username"
                children={(field) => (
                    <field.TextField
                        type="text"
                        label="Нове ім'я користувача"
                        placeholder="Введіть нове імʼя"
                        description="Латинські літери, цифри та _, від 5 до 64 символів"
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck={false}
                        className="w-full"
                    />
                )}
            />
            <Button
                size="md"
                disabled={!hydrated || mutationChangeUsername.isPending}
                variant="default"
                type="submit"
            >
                {mutationChangeUsername.isPending && <Spinner />}
                Зберегти
            </Button>
        </form>
    );
};

export default ProfileUsername;

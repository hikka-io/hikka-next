import { useMutation } from '@tanstack/react-query';
import { useHydrated } from '@tanstack/react-router';
import { toast } from 'sonner';

import { changePasswordMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { passwordSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';

const formSchema = z
    .object({
        password: passwordSchema,
        passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const PasswordSettings = () => {
    // Until hydration the form is plain HTML: a click would submit it
    // natively (GET, reload, fields in the address bar), so wait for React.
    const hydrated = useHydrated();
    const mutationChangePassword = useMutation({
        ...changePasswordMutation(),
        onSuccess: async () => {
            toast.success('Ви успішно змінили пароль.');
        },
    });

    const form = useAppForm({
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            mutationChangePassword.mutate({
                body: { password: value.password },
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
                name="password"
                children={(field) => (
                    <field.PasswordField
                        placeholder="Введіть новий пароль"
                        autoComplete="new-password"
                        label="Новий пароль"
                        className="w-full"
                    />
                )}
            />
            <form.AppField
                name="passwordConfirmation"
                children={(field) => (
                    <field.PasswordField
                        placeholder="Підтвердіть новий пароль"
                        autoComplete="new-password"
                        label="Підтвердити пароль"
                        className="w-full"
                    />
                )}
            />
            <Button
                size="md"
                disabled={!hydrated || mutationChangePassword.isPending}
                variant="default"
                type="submit"
            >
                {mutationChangePassword.isPending && <Spinner />}
                Зберегти
            </Button>
        </form>
    );
};

export default PasswordSettings;

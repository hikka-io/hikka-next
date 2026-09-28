import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHydrated } from '@tanstack/react-router';
import { toast } from 'sonner';

import { passwordResetMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { passwordSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { useParams, useRouter } from '@/utils/navigation';

import { handleAuthSuccess } from './handle-auth-success';

const formSchema = z
    .object({
        password: passwordSchema,
        passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const PasswordConfirmForm = () => {
    // Until hydration the form is plain HTML: a click would submit it
    // natively (GET, reload, fields in the address bar), so wait for React.
    const hydrated = useHydrated();
    const queryClient = useQueryClient();
    const params = useParams();
    const router = useRouter();

    const token = params.token as string;

    const mutationConfirmPasswordReset = useMutation({
        ...passwordResetMutation(),
        onSuccess: async (data) => {
            await handleAuthSuccess(data.secret, queryClient);
            form.reset();
            router.push('/');
            toast.success('Ви успішно змінили Ваш пароль.');
        },
    });

    const form = useAppForm({
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            mutationConfirmPasswordReset.mutate({
                body: {
                    password: value.password,
                    token,
                },
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
            className="space-y-4"
        >
            <form.AppField
                name="password"
                children={(field) => (
                    <field.PasswordField
                        label="Пароль"
                        placeholder="Введіть пароль"
                        autoComplete="new-password"
                    />
                )}
            />

            <form.AppField
                name="passwordConfirmation"
                children={(field) => (
                    <field.PasswordField
                        label="Підтвердження паролю"
                        placeholder="Повторіть пароль"
                        autoComplete="new-password"
                    />
                )}
            />

            <Button
                type="submit"
                className="w-full"
                disabled={
                    !hydrated ||
                    mutationConfirmPasswordReset.isPending ||
                    mutationConfirmPasswordReset.isSuccess
                }
            >
                {mutationConfirmPasswordReset.isPending && (
                    <Spinner className="mr-2" />
                )}
                Відновити
            </Button>
        </form>
    );
};

export default PasswordConfirmForm;

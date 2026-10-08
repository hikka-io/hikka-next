import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { passwordResetMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { matchFields, passwordSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { useParams, useRouter } from '@/utils/navigation';

import { handleAuthSuccess } from './handle-auth-success';

const formSchema = z
    .object({
        password: passwordSchema,
        passwordConfirmation: z.string(),
    })
    .refine(
        ...matchFields(
            'password',
            'passwordConfirmation',
            'Паролі не збігаються',
        ),
    );

const PasswordConfirmForm = () => {
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
        <form.AppForm>
            <form.Form className="space-y-4">
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

                <SubmitButton
                    className="w-full"
                    loading={mutationConfirmPasswordReset.isPending}
                    disabled={mutationConfirmPasswordReset.isSuccess}
                >
                    Відновити
                </SubmitButton>
            </form.Form>
        </form.AppForm>
    );
};

export default PasswordConfirmForm;

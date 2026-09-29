import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { changePasswordMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { matchFields, passwordSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';

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

const PasswordSettings = () => {
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
        <form.AppForm>
            <form.Form className="flex flex-col items-start gap-6">
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
                <SubmitButton
                    size="md"
                    variant="default"
                    loading={mutationChangePassword.isPending}
                >
                    Зберегти
                </SubmitButton>
            </form.Form>
        </form.AppForm>
    );
};

export default PasswordSettings;

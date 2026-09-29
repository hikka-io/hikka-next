import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signupMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import {
    emailSchema,
    matchFields,
    passwordSchema,
    USERNAME_HINT,
    usernameSchema,
} from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { useRouter } from '@/utils/navigation';

import Captcha from './captcha';
import GoogleLogin from './google-login';
import { handleAuthSuccess } from './handle-auth-success';
import { useCaptcha } from './hooks/use-captcha';

const formSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        username: usernameSchema,
        passwordConfirmation: z.string(),
    })
    .refine(
        ...matchFields(
            'password',
            'passwordConfirmation',
            'Паролі не збігаються',
        ),
    );

const SignupForm = () => {
    const queryClient = useQueryClient();
    const { captchaRef, getToken, reset } = useCaptcha();
    const router = useRouter();

    const mutationSignup = useMutation({
        ...signupMutation(),
        onSuccess: async (data) => {
            await handleAuthSuccess(data.secret, queryClient);

            toast.success(
                <span>
                    <span className="font-bold">
                        {form.getFieldValue('username')}
                    </span>
                    , Ви успішно зареєструвались.
                </span>,
            );

            form.reset();
            router.push('/');
        },
        onError: () => {
            reset();
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: '',
            password: '',
            username: '',
            passwordConfirmation: '',
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            mutationSignup.mutate({
                body: {
                    email: value.email,
                    password: value.password,
                    username: value.username,
                },
                headers: {
                    captcha: getToken(),
                },
            });
        },
    });

    return (
        <form.AppForm>
            <form.Form className="space-y-4">
                <form.AppField
                    name="username"
                    children={(field) => (
                        <field.TextField
                            type="text"
                            label="Ім'я користувача (нікнейм)"
                            placeholder="Введіть нікнейм"
                            description={USERNAME_HINT}
                            autoComplete="username"
                            autoCapitalize="none"
                            spellCheck={false}
                        />
                    )}
                />

                <form.AppField
                    name="email"
                    children={(field) => (
                        <field.TextField
                            type="email"
                            label="Email"
                            placeholder="Введіть ваш email"
                            autoComplete="email"
                        />
                    )}
                />

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

                <Captcha ref={captchaRef} />

                <SubmitButton
                    className="w-full"
                    loading={mutationSignup.isPending}
                    disabled={mutationSignup.isSuccess}
                >
                    Зареєструватись
                </SubmitButton>

                <GoogleLogin
                    disabled={
                        mutationSignup.isPending || mutationSignup.isSuccess
                    }
                    buttonText="Зареєструватись з Google"
                />
            </form.Form>
        </form.AppForm>
    );
};

export default SignupForm;

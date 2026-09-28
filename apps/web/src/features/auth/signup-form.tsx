import { Turnstile } from '@marsidev/react-turnstile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHydrated } from '@tanstack/react-router';
import { toast } from 'sonner';

import { signupMutation } from '@hikka/api';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import {
    emailSchema,
    passwordSchema,
    usernameSchema,
} from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { useRouter } from '@/utils/navigation';

import { handleAuthSuccess } from './handle-auth-success';
import { CAPTCHA_SITE_KEY, useCaptcha } from './hooks/use-captcha';
import OAuthLogin from './oauth-login';

const formSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        username: usernameSchema,
        passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const SignupForm = () => {
    // Until hydration the form is plain HTML: a click would submit it
    // natively (GET, reload, fields in the address bar), so wait for React.
    const hydrated = useHydrated();
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
        // Checked as the user types (shown once a field is left): the API
        // would refuse the same values, only after the captcha and a request.
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
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4"
        >
            <form.AppField
                name="username"
                children={(field) => (
                    <field.TextField
                        type="text"
                        label="Ім'я користувача (нікнейм)"
                        placeholder="Введіть Ваше ім'я"
                        description="Латинські літери, цифри та _, від 5 до 64 символів"
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

            <Turnstile
                ref={captchaRef}
                siteKey={CAPTCHA_SITE_KEY}
                className="flex justify-center"
            />

            <Button
                type="submit"
                className="w-full"
                disabled={
                    !hydrated ||
                    mutationSignup.isPending ||
                    mutationSignup.isSuccess
                }
            >
                {mutationSignup.isPending && <Spinner className="mr-2" />}
                Зареєструватись
            </Button>

            <OAuthLogin
                disabled={mutationSignup.isPending || mutationSignup.isSuccess}
                buttonText="Зареєструватись з Google"
            />
        </form>
    );
};

export default SignupForm;

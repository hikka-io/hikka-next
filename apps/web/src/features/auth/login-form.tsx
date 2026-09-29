import { useMutation, useQueryClient } from '@tanstack/react-query';

import { loginMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { passwordSchema } from '@/utils/form-schemas';
import { z } from '@/utils/i18n/zod';
import { Link, useRouter, useRouteSearch } from '@/utils/navigation';
import type { LoginSearch } from '@/utils/search-schemas';
import { validateRedirectUrl } from '@/utils/url';

import Captcha from './captcha';
import GoogleLogin from './google-login';
import { handleAuthSuccess } from './handle-auth-success';
import { useCaptcha } from './use-captcha';

const formSchema = z.object({
    identifier: z.string().min(5),
    password: passwordSchema,
    rememberMe: z.boolean(),
});

const LoginForm = () => {
    const queryClient = useQueryClient();
    const { callbackUrl: callbackUrlParam } = useRouteSearch<LoginSearch>();
    const { captchaRef, getToken, reset } = useCaptcha();
    const router = useRouter();

    const callbackUrl = callbackUrlParam ?? '/';

    const mutationLogin = useMutation({
        ...loginMutation(),
        onSuccess: async (data) => {
            await handleAuthSuccess(data.secret, queryClient);
            form.reset();
            router.push(validateRedirectUrl(callbackUrl));
        },
        onError: () => {
            reset();
        },
    });

    const form = useAppForm({
        defaultValues: {
            identifier: '',
            password: '',
            rememberMe: false,
        },
        validators: { onChange: formSchema },
        onSubmit: async ({ value }) => {
            const isEmail = value.identifier.includes('@');

            const body = isEmail
                ? { email: value.identifier, password: value.password }
                : { username: value.identifier, password: value.password };

            mutationLogin.mutate({
                body,
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
                    name="identifier"
                    children={(field) => (
                        <field.TextField
                            type="text"
                            label="Ваш юзернейм або пошта"
                            placeholder="Введіть ваш юзернейм або пошту"
                        />
                    )}
                />

                <form.AppField
                    name="password"
                    children={(field) => (
                        <field.PasswordField
                            label="Пароль"
                            placeholder="Введіть ваш пароль"
                        >
                            <Link
                                to="/reset"
                                className="text-primary-foreground text-sm hover:underline"
                            >
                                Забули пароль?
                            </Link>
                        </field.PasswordField>
                    )}
                />

                <Captcha ref={captchaRef} />

                <SubmitButton
                    className="w-full"
                    loading={mutationLogin.isPending}
                    disabled={mutationLogin.isSuccess}
                >
                    Увійти
                </SubmitButton>

                <GoogleLogin
                    disabled={
                        mutationLogin.isPending || mutationLogin.isSuccess
                    }
                />
            </form.Form>
        </form.AppForm>
    );
};

export default LoginForm;

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_LIMITS, loginMutation } from '@hikka/api';

import { SubmitButton, useAppForm } from '@/components/form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { z } from '@/utils/i18n/zod';
import { Link, useRouter, useRouteSearch } from '@/utils/navigation';
import { validateRedirectUrl } from '@/utils/url';

import Captcha from './captcha';
import GoogleLogin from './google-login';
import { handleAuthSuccess } from './handle-auth-success';
import { useCaptcha } from './hooks/use-captcha';

const formSchema = z.object({
    identifier: z.string().min(5),
    password: z
        .string()
        .min(API_LIMITS.password.min)
        .max(API_LIMITS.password.max),
    rememberMe: z.boolean(),
});

const LoginForm = () => {
    const queryClient = useQueryClient();
    const { callbackUrl: callbackUrlParam } = useRouteSearch<{
        callbackUrl?: string;
    }>();
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
        validators: { onSubmit: formSchema },
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
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4"
        >
            <form.Field
                name="identifier"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>
                            Ваш юзернейм або пошта
                        </FieldLabel>
                        <Input
                            id={field.name}
                            type="text"
                            placeholder="Введіть ваш юзернейм або пошту"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            <form.Field
                name="password"
                children={(field) => (
                    <Field>
                        <div className="flex items-center justify-between">
                            <FieldLabel htmlFor={field.name}>Пароль</FieldLabel>
                            <Link
                                to="/reset"
                                className="text-primary-foreground text-sm hover:underline"
                            >
                                Забули пароль?
                            </Link>
                        </div>

                        <PasswordInput
                            id={field.name}
                            placeholder="Введіть ваш пароль"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
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
                disabled={mutationLogin.isPending || mutationLogin.isSuccess}
            />
        </form>
    );
};

export default LoginForm;

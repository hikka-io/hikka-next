'use client';

import { useCreateUserSession, useHikkaClient } from '@hikka/react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { Eye, EyeOff } from 'lucide-react';
import { useRef, useState } from 'react';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { OAuthLogin } from '@/features/auth';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { setAuthCookieFn } from '@/utils/auth';
import { z } from '@/utils/i18n/zod';
import { Link, useRouter } from '@/utils/navigation';
import { validateRedirectUrl } from '@/utils/url';

const formSchema = z.object({
    identifier: z.string().min(5),
    password: z.string().min(8).max(256),
    rememberMe: z.boolean(),
});

const LoginForm = () => {
    const { client } = useHikkaClient();
    const { callbackUrl: callbackUrlParam } = useFilterSearch<{
        callbackUrl?: string;
    }>();
    const captchaRef = useRef<TurnstileInstance>(undefined);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const callbackUrl = callbackUrlParam ?? '/';

    const mutationLogin = useCreateUserSession({
        options: {
            onSuccess: async (data) => {
                await setAuthCookieFn({
                    data: { secret: data.secret },
                });
                client.setAuthToken(data.secret);
                form.reset();
                router.push(validateRedirectUrl(callbackUrl));
            },
            onError: () => {
                captchaRef.current?.reset();
            },
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

            const args = isEmail
                ? { email: value.identifier, password: value.password }
                : { username: value.identifier, password: value.password };

            mutationLogin.mutate({
                args,
                captcha: {
                    captcha: String(captchaRef.current?.getResponse()),
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
                            onChange={(e) =>
                                field.handleChange(e.target.value)
                            }
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
                            <FieldLabel htmlFor={field.name}>
                                Пароль
                            </FieldLabel>
                            <Link
                                to="/reset"
                                className="text-primary-foreground text-sm hover:underline"
                            >
                                Забули пароль?
                            </Link>
                        </div>

                        <div className="relative">
                            <Input
                                id={field.name}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Введіть ваш пароль"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="absolute top-1/2 right-2 size-8 -translate-y-1/2"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </Button>
                        </div>
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            <Turnstile
                ref={captchaRef}
                siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
            />

            <Button
                type="submit"
                className="w-full"
                disabled={
                    mutationLogin.isPending || mutationLogin.isSuccess
                }
            >
                {mutationLogin.isPending && (
                    <span className="loading loading-spinner mr-2"></span>
                )}
                Увійти
            </Button>

            <OAuthLogin
                disabled={
                    mutationLogin.isPending || mutationLogin.isSuccess
                }
            />
        </form>
    );
};

export default LoginForm;

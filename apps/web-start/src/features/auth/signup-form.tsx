import { useRef, useState } from 'react';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAuthToken, signupMutation } from '@hikka/api';
import { useHikkaClient } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import { setAuthCookieFn } from '@/utils/auth';
import { z } from '@/utils/i18n/zod';
import { useRouter } from '@/utils/navigation';

import OAuthLogin from './oauth-login';

const formSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        username: z.string().min(3),
        passwordConfirmation: z.string().min(8),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const SignupForm = () => {
    const { client } = useHikkaClient();
    const queryClient = useQueryClient();
    const captchaRef = useRef<TurnstileInstance>(undefined);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const mutationSignup = useMutation({
        ...signupMutation(),
        onSuccess: async (data) => {
            await setAuthCookieFn({
                data: { secret: data.secret },
            });
            setAuthToken(data.secret);
            client.setAuthToken(data.secret);
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: queryKeys.user.me(),
                }),
                queryClient.invalidateQueries({
                    queryKey: queryKeys.auth.tokenInfo(),
                }),
            ]);

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
            captchaRef.current?.reset();
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: '',
            password: '',
            username: '',
            passwordConfirmation: '',
        },
        validators: { onSubmit: formSchema },
        onSubmit: async ({ value }) => {
            mutationSignup.mutate({
                body: {
                    email: value.email,
                    password: value.password,
                    username: value.username,
                },
                headers: {
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
                name="username"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>
                            Ім&apos;я користувача (нікнейм)
                        </FieldLabel>
                        <Input
                            id={field.name}
                            type="text"
                            placeholder="Введіть Ваше ім'я"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </Field>
                )}
            />

            <form.Field
                name="email"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                            id={field.name}
                            type="email"
                            placeholder="Введіть ваш email"
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
                        <FieldLabel htmlFor={field.name}>Пароль</FieldLabel>
                        <div className="relative">
                            <Input
                                id={field.name}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Введіть пароль"
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
                                onClick={() => setShowPassword(!showPassword)}
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

            <form.Field
                name="passwordConfirmation"
                children={(field) => (
                    <Field>
                        <FieldLabel htmlFor={field.name}>
                            Підтвердження паролю
                        </FieldLabel>
                        <div className="relative">
                            <Input
                                id={field.name}
                                type={
                                    showPasswordConfirmation
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="Повторіть пароль"
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
                                    setShowPasswordConfirmation(
                                        !showPasswordConfirmation,
                                    )
                                }
                            >
                                {showPasswordConfirmation ? (
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

            {/* Captcha */}
            <Turnstile ref={captchaRef} siteKey="0x4AAAAAAANXs8kaCqjo_FLF" />

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full"
                disabled={mutationSignup.isPending || mutationSignup.isSuccess}
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

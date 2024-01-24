'use client';

import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import { Button } from '@/app/_components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import AuthModal from '@/app/_layout/modals/auth-modal';
import { setCookie } from '@/app/actions';
import signup from '@/utils/api/auth/signup';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import useRouter from '@/utils/useRouter';

type FormValues = {
    email: string;
    password: string;
    username: string;
    passwordConfirmation: string;
};

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const captchaRef = useRef<TurnstileInstance>();
    const { closeModal, openModal } = useModalContext();
    const form = useForm<FormValues>();
    const { setState: setAuth } = useAuthContext();
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                if (data.passwordConfirmation !== data.password) {
                    form.setError('passwordConfirmation', {
                        message: 'Пароль підтвердження не співпадає з паролем',
                    });

                    return;
                }

                const res = await signup({
                    password: data.password,
                    username: data.username,
                    email: data.email,
                    captcha: String(captchaRef.current.getResponse()),
                });

                setAuth(res);
                await setCookie('secret', res.secret);
                form.reset();
                closeModal();
                router.refresh();

                enqueueSnackbar(
                    <span>
                        <span className="font-bold">{data.username}</span>, Ви
                        успішно зареєструвались.
                    </span>,
                    { variant: 'success' },
                );

                return;
            } else {
                throw Error('No captcha found');
            }
        } catch (e) {
            console.error(e);

            if (captchaRef.current) {
                captchaRef.current?.reset();
            }

            return;
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <h2 className="text-primary">✌️ Раді познайомитись!</h2>
                    <p className="text-xs mt-2 text-muted-foreground">
                        Будь ласка, заповніть форму реєстрації.
                    </p>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-4 w-full text-left"
                >
                    <FormField
                        rules={{
                            pattern: {
                                value: /^[A-Za-z][A-Za-z0-9_]{4,63}$/i,
                                message: 'Неправильне ім’я користувача',
                            },
                            required: true,
                        }}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Ім’я користувача (нікнейм)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Введіть Ваше ім’я"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="email"
                        rules={{
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Неправильний email',
                            },
                            required: true,
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Введіть пошту"
                                        autoFocus
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        rules={{
                            required: true,
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Введіть пароль"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Не менше 8 символів.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        rules={{
                            required: true,
                        }}
                        name="passwordConfirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Підтвердження паролю</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Повторіть пароль"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
                    <div className="flex w-full flex-col gap-4">
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={form.formState.isSubmitting}
                            type="submit"
                            className="w-full"
                        >
                            {form.formState.isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Зареєструватись
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={form.formState.isSubmitting}
                            onClick={() =>
                                openModal({
                                    content: <AuthModal type="login" />,
                                    className: 'p-0 max-w-3xl',
                                })
                            }
                            className="w-full"
                        >
                            Авторизація
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Component;
'use client';

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
import AuthModal from '@/app/_components/modals/auth-modal/auth-modal';
import { setCookie } from '@/app/actions';
import login from '@/app/_utils/api/auth/login';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';
import { useModalContext } from '@/app/_utils/providers/modal-provider';
import { useRouter } from 'next/navigation';

type FormValues = {
    email: string;
    password: string;
};

const Component = () => {
    const captchaRef = useRef<TurnstileInstance>();
    const { openModal, closeModal } = useModalContext();
    const form = useForm<FormValues>();
    const { setState: setAuth } = useAuthContext();
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                const res = await login({
                    ...data,
                    captcha: String(captchaRef.current.getResponse()),
                });
                setAuth(res);
                await setCookie('secret', res.secret);
                form.reset();
                closeModal();
                router.refresh();
                return;
            } else {
                throw Error('No captcha found');
            }
        } catch (e) {
            if (captchaRef.current) {
                captchaRef.current?.reset();
            }

            console.error(e);
            return;
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <h2 className="text-primary">👋 З поверненням!</h2>
                    <p className="text-xs mt-2 text-muted-foreground">
                        Будь ласка, зареєструйтесь, або авторизуйтесь.
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
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Неправильний email',
                            },
                            required: true,
                        }}
                        name="email"
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
                        rules={{
                            required: true,
                        }}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-nowrap justify-between items-center">
                                    <FormLabel>Пароль</FormLabel>
                                    <Button
                                        variant="link"
                                        type="button"
                                        className="h-auto p-0"
                                        tabIndex={-1}
                                        onClick={() =>
                                            openModal({
                                                content: (
                                                    <AuthModal type="forgotPassword" />
                                                ),
                                                className: 'p-0 max-w-3xl',
                                            })
                                        }
                                    >
                                        Забули пароль?
                                    </Button>
                                </div>
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
                            Увійти
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={form.formState.isSubmitting}
                            onClick={() =>
                                openModal({
                                    content: <AuthModal type="signup" />,
                                    className: 'p-0 max-w-3xl',
                                })
                            }
                            className="w-full"
                        >
                            Реєстрація
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Component;
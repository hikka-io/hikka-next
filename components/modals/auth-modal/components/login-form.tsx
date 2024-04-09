'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import AuthModal from '@/components/modals/auth-modal/auth-modal';
import H2 from '@/components/typography/h2';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import login from '@/services/api/auth/login';
import { useModalContext } from '@/services/providers/modal-provider';
import { setCookie } from '@/utils/actions';

type FormValues = {
    email: string;
    password: string;
};

const Component = () => {
    const captchaRef = useRef<TurnstileInstance>();
    const { openModal, closeModal } = useModalContext();
    const form = useForm<FormValues>();
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                const res = await login({
                    ...data,
                    captcha: String(captchaRef.current.getResponse()),
                });
                await setCookie('auth', res.secret);
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
                    <H2 className="text-primary">👋 З поверненням!</H2>
                    <Small className="mt-2 text-muted-foreground">
                        Будь ласка, зареєструйтесь, або авторизуйтесь.
                    </Small>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="w-full space-y-4 text-left"
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
                                <div className="flex flex-nowrap items-center justify-between">
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

'use client';

import { useRef } from 'react';
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
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { setCookie } from '@/app/actions';
import login from '@/utils/api/auth/login';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import useRouter from '@/utils/useRouter';
import signup from '@/utils/api/auth/signup';
import { useSnackbar } from 'notistack';

type FormValues = {
    email: string;
    password: string;
    username: string;
    passwordConfirmation: string;
};


const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const captchaRef = useRef<TurnstileInstance>();
    const { closeModals, switchModal } = useModalContext();
    const form = useForm<FormValues>();
    const { setState: setAuth } = useAuthContext();
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                if (data.passwordConfirmation !== data.password) {
                    return;
                }

                const res = await signup({
                    password: data.password,
                    username: data.username,
                    email: data.email,
                    captcha: String(captchaRef.current.getResponse()),
                });

                setAuth((prev) => res);
                await setCookie('secret', res.secret);
                form.reset();
                closeModals();
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
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ім’я користувача (нікнейм)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Введіть Ваше ім’я"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
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
                                    Не менше 6 символів, не менше 2 літер.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
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
                            onClick={() => switchModal('login')}
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
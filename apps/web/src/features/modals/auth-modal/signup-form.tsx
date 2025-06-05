'use client';

import { useCreateUser } from '@hikka/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import H2 from '@/components/typography/h2';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useModalContext } from '@/services/providers/modal-provider';
import { setCookie } from '@/utils/cookies';
import { z } from '@/utils/zod';

import AuthModal from './auth-modal.component';

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

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const captchaRef = useRef<TurnstileInstance>(undefined);
    const router = useRouter();
    const { closeModal, openModal } = useModalContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutationSignup = useCreateUser({
        options: {
            onSuccess: async (data) => {
                await setCookie('auth', data.secret);
                closeModal();
                router.refresh();

                enqueueSnackbar(
                    <span>
                        <span className="font-bold">
                            {form.getValues('username')}
                        </span>
                        , Ви успішно зареєструвались.
                    </span>,
                    { variant: 'success' },
                );

                form.reset();
            },
            onError: () => {
                captchaRef.current?.reset();
            },
        },
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <H2 className="text-primary">✌️ Раді познайомитись!</H2>
                    <Small className="text-muted-foreground mt-2">
                        Будь ласка, заповніть форму реєстрації.
                    </Small>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full flex-col gap-4 text-left"
                >
                    <FormInput
                        type="text"
                        name="username"
                        placeholder="Введіть Ваше ім’я"
                        label="Ім’я користувача (нікнейм)"
                    />

                    <FormInput
                        type="email"
                        name="email"
                        placeholder="Введіть пошту"
                        label="Email"
                    />

                    <FormInput
                        type="password"
                        name="password"
                        placeholder="Введіть пароль"
                        label="Пароль"
                        description="Не менше 8 символів."
                    />

                    <FormInput
                        type="password"
                        name="passwordConfirmation"
                        placeholder="Повторіть пароль"
                        label="Підтвердження паролю"
                    />

                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
                    <div className="flex w-full flex-col gap-4">
                        <Button
                            onClick={form.handleSubmit((data) =>
                                mutationSignup.mutate({
                                    args: data,
                                    captcha: {
                                        captcha: String(
                                            captchaRef.current?.getResponse(),
                                        ),
                                    },
                                }),
                            )}
                            disabled={mutationSignup.isPending}
                            type="submit"
                            className="w-full"
                        >
                            {mutationSignup.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Зареєструватись
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={mutationSignup.isPending}
                            onClick={() =>
                                openModal({
                                    content: <AuthModal type="login" />,
                                    className: 'max-w-3xl p-0',
                                    forceModal: true,
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

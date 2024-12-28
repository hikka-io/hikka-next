'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import H2 from '@/components/typography/h2';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import AuthModal from '@/features/modals/auth-modal/auth-modal.component';

import login from '@/services/api/auth/login';
import { useModalContext } from '@/services/providers/modal-provider';
import { setCookie } from '@/utils/cookies';
import { z } from '@/utils/zod';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const Component = () => {
    const captchaRef = useRef<TurnstileInstance>(undefined);
    const { openModal, closeModal } = useModalContext();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            await setCookie('token', data.secret);
            form.reset();
            closeModal();
            router.refresh();
        },
        onError: () => {
            captchaRef.current?.reset();
        },
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate({
            params: data,
            captcha: String(captchaRef.current?.getResponse()),
        });
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
                    className="flex w-full flex-col gap-4 text-left"
                >
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
                    >
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
                                    className: 'max-w-3xl p-0',
                                    forceModal: true,
                                })
                            }
                        >
                            Забули пароль?
                        </Button>
                    </FormInput>

                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
                    <div className="flex w-full flex-col gap-4">
                        <Button
                            onClick={form.handleSubmit(handleFormSubmit)}
                            disabled={mutation.isPending}
                            type="submit"
                            className="w-full"
                        >
                            {mutation.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Увійти
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={mutation.isPending}
                            onClick={() =>
                                openModal({
                                    content: <AuthModal type="signup" />,
                                    className: 'max-w-3xl p-0',
                                    forceModal: true,
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

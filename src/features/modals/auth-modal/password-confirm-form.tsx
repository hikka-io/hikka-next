'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import FormInput from '@/components/form/form-input';
import H2 from '@/components/typography/h2';
import Small from '@/components/typography/small';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import confirmPasswordReset from '@/services/api/auth/confirmPasswordReset';
import { useModalContext } from '@/services/providers/modal-provider';
import { setCookie } from '@/utils/cookies';
import { z } from '@/utils/zod';

const formSchema = z
    .object({
        password: z.string().min(6),
        passwordConfirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Паролі не збігаються',
        path: ['passwordConfirmation'],
    });

const Component = () => {
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { closeModal } = useModalContext();

    const token = searchParams.get('token')!;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutation = useMutation({
        mutationFn: ({ password }: z.infer<typeof formSchema>) =>
            confirmPasswordReset({
                params: {
                    password,
                    token,
                },
            }),
        onSuccess: async (data) => {
            await setCookie('auth', data.secret);
            form.reset();
            closeModal();
            router.push('/anime');
            enqueueSnackbar('Ви успішно змінили Ваш пароль.', {
                variant: 'success',
            });
        },
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <H2 className="text-primary">🔓 Відновити пароль</H2>
                    <Small className="mt-2 text-muted-foreground">
                        Будь ласка, введіть новий пароль.
                    </Small>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full flex-col gap-4 text-left"
                >
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

                    <div className="flex w-full flex-col gap-4">
                        <Button
                            onClick={form.handleSubmit((data) =>
                                mutation.mutate(data),
                            )}
                            disabled={mutation.isPending}
                            type="submit"
                            className="w-full"
                        >
                            {mutation.isPending && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Відновити
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Component;

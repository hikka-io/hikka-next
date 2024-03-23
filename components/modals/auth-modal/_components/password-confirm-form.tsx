'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { setCookie } from '@/app/actions';
import confirmPasswordReset from '@/services/api/auth/confirmPasswordReset';

import { useModalContext } from '@/services/providers/modal-provider';
import H2 from '@/components/typography/h2';
import Small from '@/components/typography/small';

type FormValues = {
    password: string;
    passwordConfirmation: string;
};

const Component = () => {
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const form = useForm<FormValues>();
    const router = useRouter();

    const token = searchParams.get('token');

    const onSubmit = async (data: FormValues) => {
        try {
            if (data.passwordConfirmation !== data.password) {
                return;
            }

            const res = await confirmPasswordReset({
                password: data.password,
                token: String(token),
            });
            await setCookie('auth', res.secret);
            form.reset();
            closeModal();
            router.push('/anime');
            enqueueSnackbar('Ви успішно змінили Ваш пароль.', {
                variant: 'success',
            });
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    };

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
                    className="w-full space-y-4 text-left"
                >
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
                            Відновити
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Component;
'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useSearchParams } from 'next/navigation';

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
import confirmPasswordReset from '@/utils/api/auth/confirmPasswordReset';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import useRouter from '@/utils/useRouter';


type FormValues = {
    password: string;
    passwordConfirmation: string;
};

const Component = () => {
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const form = useForm<FormValues>();
    const { setState: setAuth } = useAuthContext();
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
            await setCookie('secret', res.secret);
            setAuth((prev) => res);
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
                    <h2 className="text-primary">🔓 Відновити пароль</h2>
                    <p className="text-xs mt-2 text-muted-foreground">
                        Будь ласка, введіть новий пароль.
                    </p>
                </div>
            </div>
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-4 w-full text-left"
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
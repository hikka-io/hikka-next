'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { Button } from '@/app/_components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import passwordReset from '@/utils/api/auth/passwordReset';
import { useModalContext } from '@/utils/providers/modal-provider';
import AuthModal from '@/app/_layout/modals/auth-modal';
import React from 'react';

type FormValues = {
    email: string;
};

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { openModal, closeModal } = useModalContext();
    const form = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await passwordReset(data);
            closeModal();
            enqueueSnackbar(
                <span>
                    <span className="font-bold">{res.username}</span>, ми
                    успішно надіслали Вам лист для відновлення паролю на вашу
                    поштову адресу.
                </span>,
                { variant: 'info' },
            );
            return;
        } catch (e) {
            if ('code' in (e as Hikka.Error)) {
                form.setError('email', { message: 'Щось пішло не так' });
            }
            console.error(e);
            return;
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <h2 className="text-primary">🔐 Відновити пароль</h2>
                    <p className="text-xs mt-2 text-muted-foreground">
                        Будь ласка, введіть дані для отримання листа
                        відновлення.
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
                                <FormMessage />
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
                        <Button
                            variant="secondary"
                            disabled={form.formState.isSubmitting}
                            onClick={() => openModal({
                                content: <AuthModal type="login" />,
                                className: 'p-0 max-w-3xl',
                            })}
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
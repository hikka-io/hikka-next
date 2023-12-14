'use client';

import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import passwordReset from '@/utils/api/auth/passwordReset';
import { useModalContext } from '@/utils/providers/ModalProvider';

type FormValues = {
    email: string;
};

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const {
        forgotPassword,
        setState: setModalState,
        switchModal,
        closeModals,
    } = useModalContext();
    const {
        register,
        reset,
        handleSubmit,
        setFocus,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await passwordReset(data);
            closeModals();
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
                setError('email', { message: 'Щось пішло не так' });
            }
            console.error(e);
            return;
        }
    };

    useEffect(() => {
        if (forgotPassword) {
            setFocus('email');
        }
    }, [open]);

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full flex-col items-center gap-6"
        >
            <div className="flex w-full flex-col items-center gap-4 text-center">
                <div>
                    <h2 className="text-accent">🔐 Відновити пароль</h2>
                    <p className="label-text-alt mt-2 opacity-60">
                        Будь ласка, введіть дані для отримання листа
                        відновлення.
                    </p>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Введіть пошту"
                        autoFocus
                        className="input w-full bg-secondary/60"
                        {...register('email', { required: true })}
                    />
                    {errors.email && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.email.message}
                            </span>
                        </label>
                    )}
                </div>
            </div>
            <div className="flex w-full flex-col gap-4">
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-accent w-full"
                >
                    {isSubmitting && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Відновити
                </button>
                <button
                    disabled={isSubmitting}
                    onClick={() => switchModal('login')}
                    className="btn btn-secondary w-full"
                >
                    Авторизація
                </button>
            </div>
        </form>
    );
};

export default Component;

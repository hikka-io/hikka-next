'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useModalContext } from '@/utils/providers/ModalProvider';
import passwordReset from '@/utils/api/auth/passwordReset';
import { useSnackbar } from 'notistack';

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
                <span><span className="font-bold">{res.username}</span>, ми успішно надіслали Вам лист для відновлення паролю на вашу поштову адресу.</span>,
                { variant: 'info' }
            )
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
            className="w-full flex flex-col items-center gap-6"
        >
            <div className="w-full text-center flex flex-col items-center gap-4">
                <div>
                    <h2 className="text-accent">🔐 Відновити пароль</h2>
                    <p className="label-text-alt opacity-60 mt-2">
                        Будь ласка, введіть дані для отримання листа
                        відновлення.
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">
                            Email
                        </span>
                    </label>
                    <input
                        type="email"
                        placeholder="Введіть пошту"
                        autoFocus
                        className="input bg-secondary/60 w-full"
                        {...register('email', { required: true })}
                    />
                    {errors.email && <label className="label">
                        <span className="label-text-alt text-error">{errors.email.message}</span>
                    </label>}
                </div>
            </div>
            <div className="w-full flex flex-col gap-4">
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

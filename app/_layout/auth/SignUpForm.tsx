'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import signup from '@/utils/api/auth/signup';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { setCookie } from '@/app/actions';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import useRouter from '@/utils/useRouter';
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
    const { signup: signupModal, closeModals, switchModal } = useModalContext();
    const {
        register,
        reset,
        handleSubmit,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();
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
                reset();
                closeModals();
                router.refresh();

                enqueueSnackbar(
                    <span>
                        <span className="font-bold">{data.username}</span>, Ви успішно зареєструвались.
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

    useEffect(() => {
        if (signupModal) {
            setFocus('email');
        }
    }, [open]);

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full flex flex-col items-center gap-8"
        >
            <div>
                <h2 className="text-accent">✌️ Раді познайомитись!</h2>
                <p className="text-neutral text-xs mt-2">
                    Будь ласка, заповніть форму реєстрації.
                </p>
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
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">
                            Ім’я користувача (нікнейм)
                        </span>
                    </label>
                    <input
                        type="text"
                        placeholder="Введіть Ваше ім’я"
                        autoFocus
                        className="input bg-secondary/60 w-full"
                        {...register('username', { required: true })}
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">
                            Пароль
                        </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Введіть пароль"
                        className="input bg-secondary/60 w-full"
                        {...register('password', {
                            required: true,
                        })}
                    />
                    <label className="label">
                        <span className="label-text">
                            Не менше 6 символів, не менше 2 літер.
                        </span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">
                            Підтвердження паролю
                        </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Повторіть пароль"
                        className="input bg-secondary/60 w-full"
                        {...register('passwordConfirmation', {
                            required: true,
                        })}
                    />
                </div>
                <Turnstile
                    className="mt-2"
                    ref={captchaRef}
                    siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                />
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
                    Зареєструватись
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

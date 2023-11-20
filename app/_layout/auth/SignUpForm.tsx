'use client';

import { useForm } from 'react-hook-form';
import {useEffect, useRef, useState} from 'react';
import signup, { Response } from '@/utils/api/auth/signup';
import { useModalContext } from '@/utils/providers/ModalProvider';
import {Turnstile, TurnstileInstance} from "@marsidev/react-turnstile";

type FormValues = {
    email: string;
    password: string;
    username: string;
    passwordConfirmation: string;
};

const Component = () => {
    const captchaRef = useRef<TurnstileInstance>();
    const { signup: signupModal, switchModal } = useModalContext();
    const [signUpUser, setSignUpUser] = useState<Response | null>(null);
    const {
        register,
        reset,
        handleSubmit,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

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
                reset();
                setSignUpUser(res);
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

    if (signUpUser) {
        return (
            <div className="w-full flex flex-col items-center gap-8">
                <h2 className="text-accent">🥳️ Вітаємо!</h2>
                <p>
                    <span className="text-accent font-bold">
                        {signUpUser.username}
                    </span>
                    , Ви успішно зареєструвались. Бажаємо приємного
                    користування!
                </p>
                <button
                    onClick={() => switchModal('login')}
                    className="btn btn-secondary w-full"
                >
                    Авторизація
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col items-center gap-8">
            <div>
                <h2 className="text-accent">✌️ Раді познайомитись!</h2>
                <p className="text-neutral text-xs mt-2">
                    Будь ласка, заповніть форму реєстрації.
                </p>
            </div>

            <div className="w-full flex flex-col gap-2">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt text-neutral">
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
                        <span className="label-text-alt text-neutral">
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
                        <span className="label-text-alt text-neutral">
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
                        <span className="label-text-alt text-neutral">
                            Не менше 6 символів, не менше 2 літер.
                        </span>
                    </label>
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt text-neutral">
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

'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import { setCookie } from '@/app/actions';
import login from '@/utils/api/auth/login';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';
import useRouter from '@/utils/useRouter';

type FormValues = {
    email: string;
    password: string;
};

const Component = () => {
    const captchaRef = useRef<TurnstileInstance>();
    const { login: loginModal, closeModals, switchModal } = useModalContext();
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
                const res = await login({
                    ...data,
                    captcha: String(captchaRef.current.getResponse()),
                });
                setAuth((prev) => res);
                await setCookie('secret', res.secret);
                reset();
                closeModals();
                router.refresh();
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
        if (loginModal) {
            setFocus('email');
        }
    }, [open]);

    return (
        <>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex w-full flex-col items-center gap-6"
            >
                <div className="flex w-full flex-col items-center gap-4 text-center">
                    <div>
                        <h2 className="text-accent">👋 З поверненням!</h2>
                        <p className="label-text-alt mt-2 opacity-60">
                            Будь ласка, зареєструйтесь, або авторизуйтесь.
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
                    </div>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Пароль</span>
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => switchModal('forgotPassword')}
                            >
                                <span className="label-text w-fit text-accent hover:underline">
                                    Забули пароль?
                                </span>
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="Введіть пароль"
                            className="input w-full bg-secondary/60"
                            {...register('password', {
                                required: true,
                            })}
                        />
                        <label className="label">
                            <span className="label-text-alt opacity-60">
                                Не менше 6 символів, не менше 2 літер.
                            </span>
                        </label>
                    </div>
                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
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
                        Увійти
                    </button>
                    <button
                        disabled={isSubmitting}
                        onClick={() => switchModal('signup')}
                        className="btn btn-secondary w-full"
                    >
                        Реєстрація
                    </button>
                </div>
            </form>
        </>
    );
};

export default Component;

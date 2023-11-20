'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { useSnackbar } from 'notistack';
import confirmPasswordReset from '@/utils/api/auth/confirmPasswordReset';
import {useSearchParams} from "next/navigation";
import {setCookie} from "@/app/actions";
import useRouter from "@/utils/useRouter";
import {useAuthContext} from "@/utils/providers/AuthProvider";

type FormValues = {
    password: string;
    passwordConfirmation: string;
};

const Component = () => {
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const {
        passwordConfirm,
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
    const router = useRouter();
    const { setState: setAuth } = useAuthContext();

    const token = searchParams.get('token');

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await confirmPasswordReset({
                password: data.password,
                token: String(token),
            });
            await setCookie('secret', res.secret);
            setAuth((prev) => res);
            reset();
            closeModals();
            router.push("/anime");
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    };

    useEffect(() => {
        if (passwordConfirm) {
            setFocus('password');
        }
    }, [open]);

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full flex flex-col items-center gap-6"
        >
            <div className="w-full text-center flex flex-col items-center gap-4">
                <div>
                    <h2 className="text-accent">🔓 Відновити пароль</h2>
                    <p className="text-neutral text-xs mt-2">
                        Будь ласка, введіть новий пароль.
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt text-neutral">
                            Пароль
                        </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Введіть пароль"
                        autoFocus
                        className="input bg-secondary/60 w-full"
                        {...register('password', { required: true })}
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt text-neutral">
                            Підтвердіть Пароль
                        </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Повторіть пароль"
                        autoFocus
                        className="input bg-secondary/60 w-full"
                        {...register('passwordConfirmation', {
                            required: true,
                        })}
                    />
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
            </div>
        </form>
    );
};

export default Component;

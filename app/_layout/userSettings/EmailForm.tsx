'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { useQueryClient } from '@tanstack/react-query';
import changeUserEmail from '@/utils/api/settings/changeUserEmail';
import {useSnackbar} from "notistack";

type FormValues = {
    email: string;
    emailConfirmation: string;
};

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { switchModal } = useModalContext();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();
    const { secret } = useAuthContext();

    const onSubmit = async (data: FormValues) => {
        if (data.email !== data.emailConfirmation) {
            return null;
        }

        try {
            await changeUserEmail({
                secret: String(secret),
                email: data.email,
            });
            await queryClient.invalidateQueries();
            switchModal('userSettings');
            enqueueSnackbar("Ви успішно змінити поштову адресу.", { variant: "success" });
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="py-8 px-8 flex flex-col gap-6"
        >
            <div className="h-12 flex items-center">
                <h3>Email</h3>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Новий email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Введіть новий email"
                        className="input bg-secondary/60 w-full"
                        {...register('email', { required: true })}
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Підтвердити email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Підтвердіть новий email"
                        className="input bg-secondary/60 w-full"
                        {...register('emailConfirmation', { required: true })}
                    />
                </div>
            </div>
            <div className="w-full">
                <button type="submit" className="btn btn-accent w-full">
                    {isSubmitting && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </button>
            </div>
        </form>
    );
};

export default Component;

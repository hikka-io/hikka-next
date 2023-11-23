'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import useRouter from '@/utils/useRouter';
import {useModalContext} from "@/utils/providers/ModalProvider";
import {useQueryClient} from "@tanstack/react-query";
import changeUserEmail from "@/utils/api/settings/changeUserEmail";
import changeUserPassword from '@/utils/api/settings/changeUserPassword';
import {useSnackbar} from "notistack";

type FormValues = {
    password: string;
    passwordConfirmation: string;
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
        if (data.password !== data.passwordConfirmation) {
            return;
        }

        try {
            await changeUserPassword({
                secret: String(secret),
                password: data.password,
            });
            await queryClient.invalidateQueries();
            switchModal('userSettings');
            enqueueSnackbar("Ви успішно змінити пароль.", { variant: "success" });
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
                <h3>Пароль</h3>
            </div>
            <div className="w-full flex flex-col gap-2">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">
                            Новий пароль
                        </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Введіть новий пароль"
                        className="input bg-secondary/60 w-full"
                        {...register('password', { required: true })}
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">
                            Підтвердити пароль
                        </span>
                    </label>
                    <input
                        type="password"
                        placeholder="Підтвердіть новий пароль"
                        className="input bg-secondary/60 w-full"
                        {...register('passwordConfirmation', {
                            required: true,
                        })}
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

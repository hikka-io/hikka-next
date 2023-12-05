'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { useModalContext } from '@/utils/providers/ModalProvider';
import { useQueryClient } from '@tanstack/react-query';
import changeUserUsername from '@/utils/api/settings/changeUserUsername';
import {useRouter} from "next/navigation";
import {useSnackbar} from "notistack";

type FormValues = {
    username: string;
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
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        try {
            await changeUserUsername({
                secret: String(secret),
                username: data.username,
            });
            await queryClient.invalidateQueries();
            router.push('/u/' + data.username);
            switchModal('userSettings');
            enqueueSnackbar("Ви успішно змінити імʼя користвача.", { variant: "success" });
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
                <h3>Ім’я користувача</h3>
            </div>
            <div className="w-full">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">
                            Нове ім’я користувача
                        </span>
                    </label>
                    <input
                        type="text"
                        placeholder="Введіть нове імʼя"
                        className="input bg-secondary/60 w-full"
                        {...register('username', { required: true })}
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

'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import changeUserDescription from '@/utils/api/settings/changeUserDescription';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useModalContext } from '@/utils/providers/ModalProvider';

type FormValues = {
    description: string;
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
    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    const onSubmit = async (data: FormValues) => {
        try {
            await changeUserDescription({
                secret: String(secret),
                description: data.description,
            });
            await queryClient.invalidateQueries();
            switchModal('userSettings');
            enqueueSnackbar(
                'Ви успішно змінити загальні налаштування профілю.',
                { variant: 'success' },
            );
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-8 py-8"
        >
            <div className="flex h-12 items-center">
                <h3>Загальне</h3>
            </div>
            <div className="w-full">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Опис</span>
                    </label>
                    <textarea
                        placeholder="Введіть опис"
                        rows={3}
                        className="textarea w-full bg-secondary/60 text-base"
                        {...register('description', {
                            value: loggedUser?.description || undefined,
                        })}
                    />
                </div>
            </div>
            <div className="w-full">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-accent w-full"
                >
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

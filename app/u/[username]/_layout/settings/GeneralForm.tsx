'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import changeUserDescription from '@/utils/api/user/changeUserDescription';
import { useQueryClient } from '@tanstack/react-query';

type FormValues = {
    description: string;
};

const Component = () => {
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();
    const { secret } = useAuthContext();

    const onSubmit = async (data: FormValues) => {
        try {
            await changeUserDescription({
                secret: String(secret),
                description: data.description,
            });
            await queryClient.invalidateQueries();
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
                <h3>Загальне</h3>
            </div>
            <div className="w-full">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text-alt text-neutral">
                            Опис
                        </span>
                    </label>
                    <textarea
                        placeholder="Введіть опис"
                        rows={3}
                        className="textarea bg-secondary/60 text-base w-full"
                        {...register('description')}
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

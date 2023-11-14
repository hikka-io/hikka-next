'use client';

import { useAuthContext } from '@/utils/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type FormValues = {
    email: string;
};

const Component = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();
    const { setState: setAuth } = useAuthContext();
    const router = useRouter();

    const onSubmit = async (data: FormValues) => {};

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="py-8 px-8 flex flex-col gap-6"
        >
            <div className="h-12 flex items-center">
                <h3>Email</h3>
            </div>
            <div className="w-full">
                <div className="form-control w-full">
                    <label className="label">
                                <span className="label-text-alt text-neutral">
                                    Новий email
                                </span>
                    </label>
                    <input
                        type="email"
                        placeholder="Введіть новий email"
                        className="input bg-secondary w-full"
                        {...register('email', { required: true })}
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

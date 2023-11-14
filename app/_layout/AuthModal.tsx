'use client';

import Modal from '@/app/_components/Modal';
import Image from '@/app/_components/Image';
import {useAuthContext} from '@/utils/providers/AuthProvider';
import {useForm} from 'react-hook-form';
import login from '@/utils/api/auth/login';
import {useRouter} from "next/navigation";
import {setCookie} from "@/app/actions";
import {Dispatch, SetStateAction} from "react";
// import {setCookie} from "cookies-next";

type LoginFormValues = {
    email: string;
    password: string;
};

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const Component = ({ open, setOpen }: Props) => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>();
    const { setState: setAuth } = useAuthContext();
    const router = useRouter();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const res = await login(data);
            setAuth((prev) => res);
            await setCookie('secret', res.secret);
            reset();
            setOpen(false);
            router.refresh();
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    };

    return (
        <Modal
            open={open}
            onDismiss={() => setOpen(false)}
            id="authModal"
            boxClassName="p-0"
        >
            <div className="grid md:grid-cols-[40%_1fr] grid-cols-1">
                <div className="relative hidden md:block">
                    <Image
                        src="https://images.pexels.com/photos/18608193/pexels-photo-18608193.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                        alt="test"
                    />
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="py-8 px-8 flex flex-col items-center gap-6"
                >
                    <Image src="/logo.svg" alt="Hikka" width={85} height={25} />
                    <div className="w-full text-center flex flex-col gap-2">
                        <h2 className="text-accent">👋 З поверненням!</h2>
                        <p className="text-neutral text-xs">
                            Будь ласка зареєструйтесь, або авторизуйтесь.
                        </p>
                    </div>
                    <div className="w-full">
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
                                className="input bg-secondary w-full"
                                {...register('email', { required: true })}
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
                                className="input bg-secondary w-full"
                                {...register('password', { required: true })}
                            />
                            <label className="label">
                                <span className="label-text-alt text-neutral">
                                    Не менше 6 символів, не менше 2 літер.
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="w-full">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="btn btn-accent w-full"
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Увійти
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default Component;

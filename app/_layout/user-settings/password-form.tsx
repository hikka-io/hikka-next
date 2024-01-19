'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import changeUserEmail from '@/utils/api/settings/changeUserEmail';
import changeUserPassword from '@/utils/api/settings/changeUserPassword';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import useRouter from '@/utils/useRouter';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Input } from '@/app/_components/ui/input';

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
            enqueueSnackbar('Ви успішно змінили пароль.', {
                variant: 'success',
            });
            return;
        } catch (e) {
            console.error(e);
            return;
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 p-6"
        >
            <div className="flex items-center">
                <h3>Пароль</h3>
            </div>
            <div className="flex w-full flex-col gap-6">
                <div className="flex flex-col gap-2 w-full">
                    <Label className="label">
                        Новий пароль
                    </Label>
                    <Input
                        type="password"
                        placeholder="Введіть новий пароль"
                        {...register('password', { required: true })}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <Label className="label">
                        Підтвердити пароль
                    </Label>
                    <Input
                        type="password"
                        placeholder="Підтвердіть новий пароль"
                        {...register('passwordConfirmation', {
                            required: true,
                        })}
                    />
                </div>
            </div>
            <div className="w-full">
                <Button disabled={isSubmitting} variant="accent" type="submit" className="w-full">
                    {isSubmitting && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Зберегти
                </Button>
            </div>
        </form>
    );
};

export default Component;

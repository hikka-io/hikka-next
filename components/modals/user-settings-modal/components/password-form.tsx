'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';



import { useQueryClient } from '@tanstack/react-query';



import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import changeUserPassword from '@/services/api/settings/changeUserPassword';
import useAuth from '@/services/hooks/auth/useAuth';

import { useModalContext } from '@/services/providers/modal-provider';


type FormValues = {
    password: string;
    passwordConfirmation: string;
};

const Component = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormValues>();
    const { auth } = useAuth();

    const onSubmit = async (data: FormValues) => {
        if (data.password !== data.passwordConfirmation) {
            return;
        }

        try {
            await changeUserPassword({
                auth: String(auth),
                password: data.password,
            });
            await queryClient.invalidateQueries();
            closeModal();
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
                <H3>Пароль</H3>
            </div>
            <div className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-2">
                    <Label>Новий пароль</Label>
                    <Input
                        type="password"
                        placeholder="Введіть новий пароль"
                        {...register('password', { required: true })}
                    />
                </div>
                <div className="flex w-full flex-col gap-2">
                    <Label>Підтвердити пароль</Label>
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
                <Button
                    disabled={isSubmitting}
                    variant="default"
                    type="submit"
                    className="w-full"
                >
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
'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import changeUserEmail from '@/utils/api/settings/changeUserEmail';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { Input } from '@/app/_components/ui/input';

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
            enqueueSnackbar('Ви успішно змінити поштову адресу.', {
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
                <h3>Email</h3>
            </div>
            <div className="flex w-full flex-col gap-6">
                <div className="flex flex-col gap-2 w-full">
                    <Label className="label">
                        Новий email
                    </Label>
                    <Input
                        type="email"
                        placeholder="Введіть новий email"
                        {...register('email', { required: true })}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <Label className="label">
                        Підтвердити email
                    </Label>
                    <Input
                        type="email"
                        placeholder="Підтвердіть новий email"
                        {...register('emailConfirmation', { required: true })}
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

'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import H3 from '@/components/typography/h3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import changeUserEmail from '@/services/api/settings/changeUserEmail';

import { useModalContext } from '@/services/providers/modal-provider';
import useAuth from '@/services/hooks/auth/useAuth';


type FormValues = {
    email: string;
    emailConfirmation: string;
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
        if (data.email !== data.emailConfirmation) {
            return null;
        }

        try {
            await changeUserEmail({
                auth: String(auth),
                email: data.email,
            });
            await queryClient.invalidateQueries();
            closeModal();
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
                <H3>Email</H3>
            </div>
            <div className="flex w-full flex-col gap-6">
                <div className="flex w-full flex-col gap-2">
                    <Label className="label">Новий email</Label>
                    <Input
                        type="email"
                        placeholder="Введіть новий email"
                        {...register('email', { required: true })}
                    />
                </div>
                <div className="flex w-full flex-col gap-2">
                    <Label className="label">Підтвердити email</Label>
                    <Input
                        type="email"
                        placeholder="Підтвердіть новий email"
                        {...register('emailConfirmation', { required: true })}
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

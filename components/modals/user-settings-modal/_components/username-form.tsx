'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import changeUserUsername from '@/services/api/settings/changeUserUsername';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';


type FormValues = {
    username: string;
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
            closeModal();
            enqueueSnackbar('Ви успішно змінити імʼя користвача.', {
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
                <h3>Ім’я користувача</h3>
            </div>
            <div className="w-full">
                <div className="flex flex-col gap-2 w-full">
                    <Label className="label">Нове ім’я користувача</Label>
                    <Input
                        type="text"
                        placeholder="Введіть нове імʼя"
                        {...register('username', { required: true })}
                    />
                </div>
            </div>
            <div className="w-full">
                <Button variant="accent" type="submit" className="w-full">
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
'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import changeUserDescription from '@/services/api/settings/changeUserDescription';
import useAuth from '@/services/hooks/auth/useAuth';
import { useModalContext } from '@/services/providers/modal-provider';

type FormValues = {
    description: string;
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
    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'loggedUser',
        auth,
    ]);

    const onSubmit = async (data: FormValues) => {
        try {
            await changeUserDescription({
                auth: String(auth),
                description: data.description,
            });
            await queryClient.invalidateQueries();
            closeModal();
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
            className="flex flex-col gap-6 p-6"
        >
            <div className="w-full">
                <div className="flex w-full flex-col gap-2">
                    <Label>Опис</Label>
                    <Textarea
                        placeholder="Введіть опис"
                        rows={3}
                        {...register('description', {
                            value: loggedUser?.description || undefined,
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

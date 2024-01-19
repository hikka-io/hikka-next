'use client';

import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import { useQueryClient } from '@tanstack/react-query';

import changeUserDescription from '@/utils/api/settings/changeUserDescription';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';
import { Button } from '@/app/_components/ui/button';
import { Textarea } from '@/app/_components/ui/textarea';
import { Label } from '@/app/_components/ui/label';


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
            className="flex flex-col gap-6 p-6"
        >
            <div className="flex items-center">
                <h3>Загальне</h3>
            </div>
            <div className="w-full">
                <div className="space-y-2 w-full">
                    <Label>
                        Опис
                    </Label>
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
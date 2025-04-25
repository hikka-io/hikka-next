'use client';

import {
    useCreateActivationRequest,
    useSession,
    useUserByUsername,
} from '@hikka/react';
import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

import { Button } from '@/components/ui/button';

import MaterialSymbolsInfoRounded from '../../components/icons/material-symbols/MaterialSymbolsInfoRounded';

const ActivationAlert = () => {
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const { data: user } = useUserByUsername({
        username: String(params.username),
    });
    const { user: loggedUser } = useSession();

    const { mutate: resendActivation } = useCreateActivationRequest({
        options: {
            onSuccess: (user) => {
                enqueueSnackbar(
                    <span>
                        <span className="font-bold">{user.username}</span>, ми
                        успішно надіслали Вам лист для підтвердження поштової
                        адреси.
                    </span>,
                    { variant: 'success' },
                );
            },
            onError: (error) => {
                if ('code' in (error as any)) {
                    if ((error as any).code === 'auth-modal:activation_valid') {
                        enqueueSnackbar(
                            <span>
                                <span className="font-bold">
                                    {loggedUser?.username}
                                </span>
                                , Ваше посилання досі активне. Перегляньте, будь
                                ласка, вашу поштову скриньку для активації
                                акаунту.
                            </span>,
                            { variant: 'error' },
                        );
                    }
                }
            },
        },
    });

    if (
        !loggedUser ||
        loggedUser.role !== 'not_activated' ||
        user?.username !== loggedUser.username
    ) {
        return null;
    }

    return (
        <div className="border-border bg-secondary/20 flex items-center gap-4 rounded-md border p-4">
            <MaterialSymbolsInfoRounded className="text-xl" />
            <span className="flex-1 text-sm">
                На вашу пошту відправлено лист з активацією пошти. Будь ласка,
                перейдіть за посилання у листі. Якщо Ваш лист не прийшов, будь
                ласка,{' '}
                <Button
                    onClick={() => resendActivation()}
                    variant="link"
                    className="text-primary h-auto p-0 hover:underline"
                >
                    відправте його повторно
                </Button>
                .
            </span>
        </div>
    );
};

export default ActivationAlert;

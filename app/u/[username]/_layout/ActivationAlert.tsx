'use client';

import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import resendActivation from '@/utils/api/auth/resendActivation';
import { useSnackbar } from 'notistack';
import {useParams} from "next/navigation";

const Component = () => {
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    const user: Hikka.User | undefined = queryClient.getQueryData([
        'user',
        params.username,
    ]);

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    if (!loggedUser || loggedUser.role !== 'not_activated' || user?.username !== loggedUser.username) {
        return null;
    }

    const resend = async () => {
        try {
            await resendActivation({ secret: String(secret) });
            enqueueSnackbar(
                <span>
                    <span className="font-bold">{loggedUser.username}</span>, ми
                    успішно надіслали Вам лист для підтвердження поштової
                    адреси.
                </span>,
                { variant: 'success' },
            );
        } catch (e) {
            if ('code' in (e as Hikka.Error)) {
                if ((e as Hikka.Error).code === 'auth:activation_valid') {
                    enqueueSnackbar(
                        <span>
                            <span className="font-bold">
                                {loggedUser.username}
                            </span>
                            , Ваше посилання досі активне. Перегляньте, будь
                            ласка, вашу поштову скриньку для активації акаунту.
                        </span>,
                        { variant: 'error' },
                    );
                }
            }
        }
    };

    return (
        <div>
            <div className="alert bg-secondary/30 border-secondary">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="text-sm">
                    На вашу пошту відправлено лист з активацією пошти. Будь
                    ласка, перейдіть за посилання у листі. Якщо Ваш лист не
                    прийшов, будь ласка,{' '}
                    <button
                        onClick={resend}
                        className="hover:underline text-accent"
                    >
                        відправте його повторно
                    </button>
                    .
                </span>
            </div>
        </div>
    );
};

export default Component;
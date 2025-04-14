'use client';

import { useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

import { Button } from '@/components/ui/button';

import resendActivation from '@/services/api/auth/resendActivation';
import useSession from '@/services/hooks/auth/use-session';
import useUser from '@/services/hooks/user/use-user';

import MaterialSymbolsInfoRounded from '../../components/icons/material-symbols/MaterialSymbolsInfoRounded';

const ActivationAlert = () => {
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const { data: user } = useUser({ username: String(params.username) });
    const { user: loggedUser } = useSession();

    if (
        !loggedUser ||
        loggedUser.role !== 'not_activated' ||
        user?.username !== loggedUser.username
    ) {
        return null;
    }

    const resend = async () => {
        try {
            await resendActivation();
            enqueueSnackbar(
                <span>
                    <span className="font-bold">{loggedUser.username}</span>, ми
                    успішно надіслали Вам лист для підтвердження поштової
                    адреси.
                </span>,
                { variant: 'success' },
            );
        } catch (e) {
            if ('code' in (e as API.Error)) {
                if ((e as API.Error).code === 'auth-modal:activation_valid') {
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
        <div className="flex items-center gap-4 rounded-md border border-border bg-secondary/20 p-4">
            <MaterialSymbolsInfoRounded className="text-xl" />
            <span className="flex-1 text-sm">
                На вашу пошту відправлено лист з активацією пошти. Будь ласка,
                перейдіть за посилання у листі. Якщо Ваш лист не прийшов, будь
                ласка,{' '}
                <Button
                    onClick={resend}
                    variant="link"
                    className="h-auto p-0 text-primary hover:underline"
                >
                    відправте його повторно
                </Button>
                .
            </span>
        </div>
    );
};

export default ActivationAlert;

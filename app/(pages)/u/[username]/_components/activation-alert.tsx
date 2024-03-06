'use client';

import { useSnackbar } from 'notistack';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import resendActivation from '@/services/api/auth/resendActivation';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';
import useUser from '@/services/hooks/user/useUser';
import { useAuthContext } from '@/services/providers/auth-provider';


const Component = () => {
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { secret } = useAuthContext();

    const { data: user } = useUser(String(params.username));
    const { data: loggedUser } = useLoggedUser();

    if (
        !loggedUser ||
        loggedUser.role !== 'not_activated' ||
        user?.username !== loggedUser.username
    ) {
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
        <div className="flex items-center gap-4 p-4 border rounded-md border-secondary/60 bg-secondary/30">
            <MaterialSymbolsInfoRounded className="text-xl" />
            <span className="text-sm flex-1">
                На вашу пошту відправлено лист з активацією пошти. Будь ласка,
                перейдіть за посилання у листі. Якщо Ваш лист не прийшов, будь
                ласка,{' '}
                <Button
                    onClick={resend}
                    variant="link"
                    className="text-primary hover:underline p-0 h-auto"
                >
                    відправте його повторно
                </Button>
                .
            </span>
        </div>
    );
};

export default Component;

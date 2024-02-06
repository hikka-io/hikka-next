'use client';

import { useSnackbar } from 'notistack';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import { useParams } from 'next/navigation';

import {  useUser } from '@/app/(pages)/u/[username]/page.hooks';
import { Button } from '@/app/_components/ui/button';
import resendActivation from '@/app/_utils/api/auth/resendActivation';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';
import { useLoggedUser } from '@/app/page.hooks';


const Component = () => {
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { secret } = useAuthContext();

    const { data: user } = useUser(String(params.username));
    const { data: loggedUser } = useLoggedUser(String(secret));

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
            if ('code' in (e as Hikka.Error)) {
                if ((e as Hikka.Error).code === 'auth-modal:activation_valid') {
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
            <div className="flex items-center gap-4 p-4 border rounded-md border-secondary/60 bg-secondary/30">
                <MaterialSymbolsInfoRounded className="text-xl" />
                <span className="text-sm flex-1">
                    На вашу пошту відправлено лист з активацією пошти. Будь
                    ласка, перейдіть за посилання у листі. Якщо Ваш лист не
                    прийшов, будь ласка,{' '}
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
        </div>
    );
};

export default Component;
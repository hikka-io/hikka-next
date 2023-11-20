'use client';

import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/utils/providers/AuthProvider';

const Component = () => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
        secret,
    ]);

    if (!loggedUser || loggedUser.role !== 'not_activated') {
        return null;
    }

    const resendActivation = () => {

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
                        onClick={resendActivation}
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

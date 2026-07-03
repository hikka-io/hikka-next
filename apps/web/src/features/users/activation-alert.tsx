import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { activationResendMutation, userProfileOptions } from '@hikka/api';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/hooks/use-session';
import { useParams } from '@/utils/navigation';

const ActivationAlert = () => {
    const params = useParams();

    const { data: user } = useQuery(
        userProfileOptions({
            path: { username: String(params.username) },
        }),
    );
    const { user: loggedUser } = useSession();

    const { mutate: resendActivation } = useMutation({
        ...activationResendMutation(),
        onSuccess: (user) => {
            toast.success(
                <span>
                    <span className="font-bold">{user.username}</span>, ми
                    успішно надіслали Вам лист для підтвердження поштової
                    адреси.
                </span>,
            );
        },
        onError: (error) => {
            if ('code' in (error as any)) {
                if ((error as any).code === 'auth-modal:activation_valid') {
                    toast.error(
                        <span>
                            <span className="font-bold">
                                {loggedUser?.username}
                            </span>
                            , Ваше посилання досі активне. Перегляньте, будь
                            ласка, вашу поштову скриньку для активації акаунту.
                        </span>,
                    );
                }
            }
        },
    });

    if (
        loggedUser?.role !== 'not_activated' ||
        user?.username !== loggedUser.username
    ) {
        return null;
    }

    return (
        <div className="flex items-center gap-4 rounded-md border border-border surface-solid p-4">
            <MaterialSymbolsInfoRounded className="text-xl" />
            <span className="flex-1 text-sm">
                На вашу пошту відправлено лист з активацією пошти. Будь ласка,
                перейдіть за посилання у листі. Якщо Ваш лист не прийшов, будь
                ласка,{' '}
                <Button
                    onClick={() => resendActivation({})}
                    variant="link"
                    className="h-auto p-0 text-primary-foreground hover:underline"
                >
                    відправте його повторно
                </Button>
                .
            </span>
        </div>
    );
};

export default ActivationAlert;

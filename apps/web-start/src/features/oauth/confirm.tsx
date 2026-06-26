import type { FC } from 'react';

import { getRouteApi } from '@tanstack/react-router';

import { useMutation } from '@tanstack/react-query';
import { requestTokenMutation } from '@hikka/api';
import { useSession } from '@/features/auth/hooks/use-session';

import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';

type Props = {};

const routeApi = getRouteApi('/_pages/oauth');

const Confirm: FC<Props> = () => {
    const { reference, scope } = routeApi.useSearch();

    const scopes = scope?.split(',');

    const { user } = useSession();

    const { mutate, isPending } = useMutation({
        ...requestTokenMutation(),
        onSuccess: (data) => {
            window.location.href = data.redirect_url;
        },
    });

    const handleConfirm = () => {
        mutate({
            path: { client_reference: reference! },
            body: {
                scope: scopes!,
            },
        });
    };

    return (
        <Button
            className="w-full"
            disabled={!user || isPending}
            onClick={handleConfirm}
        >
            {isPending && <Spinner />}
            Продовжити
        </Button>
    );
};

export default Confirm;

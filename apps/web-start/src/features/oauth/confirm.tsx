'use client';

import { useCreateThirdPartyTokenRequest, useSession } from '@hikka/react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

interface Props {}

const Confirm: FC<Props> = () => {
    const { reference, scope } = useFilterSearch<{
        reference?: string;
        scope?: string;
    }>();

    const scopes = scope?.split(',');

    const { user } = useSession();

    const { mutate, isPending } = useCreateThirdPartyTokenRequest({
        options: {
            onSuccess: (data) => {
                window.location.href = data.redirect_url;
            },
        },
    });

    const handleConfirm = () => {
        mutate({
            clientReference: reference!,
            args: {
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
            {isPending && <span className="loading loading-spinner"></span>}
            Продовжити
        </Button>
    );
};

export default Confirm;

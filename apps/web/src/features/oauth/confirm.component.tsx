'use client';

import { useCreateThirdPartyTokenRequest, useSession } from '@hikka/react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

interface Props {}

const Confirm: FC<Props> = () => {
    const searchParams = useSearchParams();

    const reference = searchParams.get('reference')!;
    const scopes = searchParams.get('scope')?.split(',');

    const { user } = useSession();

    const { mutate, isPending } = useCreateThirdPartyTokenRequest();

    const handleConfirm = () => {
        mutate({
            clientReference: reference,
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

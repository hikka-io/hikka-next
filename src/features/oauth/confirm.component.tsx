'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import useSession from '@/services/hooks/auth/use-session';
import useClient from '@/services/hooks/client/use-client';

interface Props {}

const Confirm: FC<Props> = () => {
    const searchParams = useSearchParams();

    const reference = searchParams.get('reference')!;
    const scopes = searchParams.get('scope')?.split(',');

    const { user } = useSession();

    const { data: client } = useClient({
        client_reference: reference,
    });

    return (
        <Button className="w-full" disabled={!user}>
            Продовжити
        </Button>
    );
};

export default Confirm;

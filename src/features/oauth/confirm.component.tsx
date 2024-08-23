'use client';

import { FC } from 'react';

import { Button } from '@/components/ui/button';

import useSession from '@/services/hooks/auth/use-session';

interface Props {}

const Confirm: FC<Props> = () => {
    const { user } = useSession();

    return (
        <Button className="w-full" disabled={!user}>
            Продовжити
        </Button>
    );
};

export default Confirm;

'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useLoggedUser } from '@/app/page.hooks';

interface Props {
    onSaveSubmit: (data: any) => Promise<void>;
    handleSubmit: (
        onSubmit: (data: any) => Promise<void>,
    ) => () => void;
}

const Component = ({ onSaveSubmit, handleSubmit }: Props) => {
    const { secret } = useAuthContext();

    const { data: loggedUser } = useLoggedUser(String(secret));

    if (!loggedUser || loggedUser.role === 'user') {
        return null;
    }

    const onAcceptSubmit = async (data: any) => {
        return await onSaveSubmit({ ...data, auto: true });
    };

    return (
        <Button
            className="w-fit"
            variant="outline"
            onClick={handleSubmit(onAcceptSubmit)}
        >
            Прийняти
        </Button>
    );
};

export default Component;

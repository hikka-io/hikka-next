'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import useLoggedUser from '@/services/hooks/user/useLoggedUser';

interface Props {
    onSaveSubmit: (data: any) => Promise<void>;
    handleSubmit: (onSubmit: (data: any) => Promise<void>) => () => void;
}

const AutoButton = ({ onSaveSubmit, handleSubmit }: Props) => {
    const { data: loggedUser } = useLoggedUser();

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

export default AutoButton;

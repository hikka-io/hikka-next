'use client';

import { FC } from 'react';

import { Button } from '@/components/ui/button';

import useSession from '@/services/hooks/auth/use-session';

interface Props {
    onSubmit: (data: any) => Promise<void>;
    handleSubmit: (onSubmit: (data: any) => Promise<void>) => () => void;
}

const AutoButton: FC<Props> = ({ onSubmit, handleSubmit }) => {
    const { user: loggedUser } = useSession();

    if (!loggedUser || loggedUser.role === 'user') {
        return null;
    }

    const onAcceptSubmit = async (data: any) => {
        return await onSubmit({ ...data, auto: true });
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

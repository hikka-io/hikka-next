'use client';

import { useAcceptEdit } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

interface Props {}

const AcceptAction: FC<Props> = () => {
    const params = useParams();
    const acceptEditMutation = useAcceptEdit();

    const handleClick = () => {
        acceptEditMutation.mutate(Number(params.editId));
    };

    return (
        <Button
            variant="success"
            size="md"
            disabled={acceptEditMutation.isPending}
            onClick={handleClick}
        >
            Прийняти
        </Button>
    );
};

export default AcceptAction;

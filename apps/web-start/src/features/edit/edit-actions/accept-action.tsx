'use client';

import type { FC } from 'react';

import { useAcceptEdit } from '@hikka/react';

import { Button } from '@/components/ui/button';
import { useParams } from '@/utils/navigation';

type Props = {};

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

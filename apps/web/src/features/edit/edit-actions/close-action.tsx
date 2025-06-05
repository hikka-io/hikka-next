'use client';

import { useCloseEdit } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

interface Props {}

const CloseAction: FC<Props> = () => {
    const params = useParams();
    const closeEditMutation = useCloseEdit();

    const handleClick = () => {
        closeEditMutation.mutate(Number(params.editId));
    };

    return (
        <Button
            variant="outline"
            size="md"
            disabled={closeEditMutation.isPending}
            onClick={handleClick}
        >
            Закрити
        </Button>
    );
};

export default CloseAction;

'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import useActionEdit from '@/services/hooks/edit/use-action-edit';

interface Props {}

const CloseAction: FC<Props> = () => {
    const params = useParams();
    const mutation = useActionEdit({ action: 'close' });

    const handleClick = () => {
        mutation.mutate({
            params: {
                edit_id: Number(params.editId),
            },
        });
    };

    return (
        <Button
            variant="outline"
            size="md"
            disabled={mutation.isPending}
            onClick={handleClick}
        >
            Закрити
        </Button>
    );
};

export default CloseAction;

'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import useActionEdit from '@/services/hooks/edit/use-action-edit';

interface Props {}

const AcceptAction: FC<Props> = () => {
    const params = useParams();
    const mutation = useActionEdit({ action: 'accept' });

    const handleClick = () => {
        mutation.mutate({
            params: {
                edit_id: Number(params.editId),
            },
        });
    };

    return (
        <Button
            variant="success"
            size="md"
            disabled={mutation.isPending}
            onClick={handleClick}
        >
            Прийняти
        </Button>
    );
};

export default AcceptAction;

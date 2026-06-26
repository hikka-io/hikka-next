import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acceptEditMutation, getEditQueryKey } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { useParams } from '@/utils/navigation';

type Props = {};

const AcceptAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const acceptEdit = useMutation({
        ...acceptEditMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getEditQueryKey({
                    path: { edit_id: Number(params.editId) },
                }),
            });
        },
    });

    const handleClick = () => {
        acceptEdit.mutate({ path: { edit_id: Number(params.editId) } });
    };

    return (
        <Button
            variant="success"
            size="md"
            disabled={acceptEdit.isPending}
            onClick={handleClick}
        >
            Прийняти
        </Button>
    );
};

export default AcceptAction;

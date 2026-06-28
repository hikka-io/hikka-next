import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { closeEditMutation, getEditQueryKey } from '@hikka/api';

import { Button } from '@/components/ui/button';
import { invalidateEdits } from '@/utils/api/invalidate-content-state';
import { useParams } from '@/utils/navigation';

type Props = {};

const CloseAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const closeEdit = useMutation({
        ...closeEditMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getEditQueryKey({
                    path: { edit_id: Number(params.editId) },
                }),
            });
            invalidateEdits(queryClient);
        },
    });

    const handleClick = () => {
        closeEdit.mutate({ path: { edit_id: Number(params.editId) } });
    };

    return (
        <Button
            variant="outline"
            size="md"
            disabled={closeEdit.isPending}
            onClick={handleClick}
        >
            Закрити
        </Button>
    );
};

export default CloseAction;

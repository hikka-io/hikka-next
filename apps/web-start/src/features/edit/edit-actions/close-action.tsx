import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { closeEditMutation } from '@hikka/api';

import { Button } from '@/components/ui/button';
import {
    invalidateEditDetail,
    invalidateEdits,
} from '@/utils/api/invalidate-content-state';
import { useParams } from '@/utils/navigation';

type Props = {};

const CloseAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const closeEdit = useMutation({
        ...closeEditMutation(),
        onSuccess: () => {
            invalidateEditDetail(queryClient, Number(params.editId));
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

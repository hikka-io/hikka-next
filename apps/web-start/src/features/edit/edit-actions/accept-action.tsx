import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acceptEditMutation, type EditResponse } from '@hikka/api';

import { Button } from '@/components/ui/button';
import {
    invalidateContentBySlug,
    invalidateEditDetail,
    invalidateEdits,
} from '@/utils/api/invalidate-content-state';

type Props = {
    edit: EditResponse;
};

const AcceptAction: FC<Props> = ({ edit }) => {
    const queryClient = useQueryClient();
    const acceptEdit = useMutation({
        ...acceptEditMutation(),
        onSuccess: () => {
            invalidateEditDetail(queryClient, edit.edit_id);
            invalidateEdits(queryClient);
            // An accepted edit mutates the underlying content — refresh it.
            // Source the slug from the loaded edit, not the mutation response
            // (which may not populate `content`).
            invalidateContentBySlug(queryClient, edit.content.slug);
        },
    });

    const handleClick = () => {
        acceptEdit.mutate({ path: { edit_id: edit.edit_id } });
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

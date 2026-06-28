import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acceptEditMutation, getEditQueryKey } from '@hikka/api';

import { Button } from '@/components/ui/button';
import {
    invalidateContentBySlug,
    invalidateEdits,
} from '@/utils/api/invalidate-content-state';
import { useParams } from '@/utils/navigation';

type Props = {};

const AcceptAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const acceptEdit = useMutation({
        ...acceptEditMutation(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: getEditQueryKey({
                    path: { edit_id: Number(params.editId) },
                }),
            });
            invalidateEdits(queryClient);

            // An accepted edit mutates the underlying content — refresh it.
            const slug = data.content?.slug;
            if (slug) invalidateContentBySlug(queryClient, slug);
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

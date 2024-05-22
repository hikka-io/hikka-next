'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

import acceptEdit from '@/services/api/edit/acceptEdit';

interface Props {}

const AcceptAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: acceptEdit,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['edit', params.editId],
            });
        },
    });

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
            size="sm"
            disabled={mutation.isPending}
            onClick={handleClick}
        >
            Прийняти
        </Button>
    );
};

export default AcceptAction;

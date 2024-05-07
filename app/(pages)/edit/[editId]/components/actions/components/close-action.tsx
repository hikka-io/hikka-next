'use client';

import * as React from 'react';
import { FC } from 'react';

import { useParams } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import closeEdit from '@/services/api/edit/closeEdit';

interface Props {}

const CloseAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: closeEdit,
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
            variant="outline"
            size="sm"
            disabled={mutation.isPending}
            onClick={handleClick}
        >
            Закрити
        </Button>
    );
};

export default CloseAction;

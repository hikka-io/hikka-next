'use client';

import * as React from 'react';
import { FC } from 'react';

import { useParams } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import denyEdit from '@/services/api/edit/denyEdit';

interface Props {}

const DenyAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: denyEdit,
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
            variant="destructive"
            size="sm"
            disabled={mutation.isPending}
            onClick={handleClick}
        >
            Відхилити
        </Button>
    );
};

export default DenyAction;

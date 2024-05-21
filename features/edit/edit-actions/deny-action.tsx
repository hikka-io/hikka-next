'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { FC } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={mutation.isPending}
                >
                    Відхилити
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете відхилити правку?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відмінити</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClick}>
                        Підтвердити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DenyAction;

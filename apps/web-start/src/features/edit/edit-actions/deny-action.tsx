import type { FC } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { denyEditMutation, getEditQueryKey } from '@hikka/api';

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
import { useParams } from '@/utils/navigation';

type Props = {};

const DenyAction: FC<Props> = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const denyEdit = useMutation({
        ...denyEditMutation(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getEditQueryKey({
                    path: { edit_id: Number(params.editId) },
                }),
            });
        },
    });

    const handleClick = () => {
        denyEdit.mutate({ path: { edit_id: Number(params.editId) } });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="md"
                    disabled={denyEdit.isPending}
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

'use client';

import { useParams } from 'next/navigation';
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

import useActionEdit from '@/services/hooks/edit/use-action-edit';

interface Props {}

const DenyAction: FC<Props> = () => {
    const params = useParams();
    const mutation = useActionEdit({ action: 'deny' });

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
                    size="md"
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

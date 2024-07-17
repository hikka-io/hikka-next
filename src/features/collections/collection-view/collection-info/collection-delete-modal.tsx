'use client';

import { useParams } from 'next/navigation';
import MaterialSymbolsDeleteForeverRounded from '~icons/material-symbols/delete-forever-rounded';

import P from '@/components/typography/p';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import useCollection from '@/services/hooks/collections/use-collection';
import useDeleteCollection from '@/services/hooks/collections/use-delete-collection';

const CollectionDeleteModal = () => {
    const params = useParams();

    const { data: collection } = useCollection({
        reference: String(params.reference),
    });

    const { mutate: mutateDeleteCollection } = useDeleteCollection({
        reference: String(params.reference),
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive">
                    <MaterialSymbolsDeleteForeverRounded className="text-lg" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Ви впевнені, що хочете видалити колекцію?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <P>
                            Колекція{' '}
                            <span className="font-bold">
                                {collection?.title}
                            </span>{' '}
                            буде видалена назавжди.
                        </P>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відмінити</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutateDeleteCollection()}>
                        Підтвердити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CollectionDeleteModal;

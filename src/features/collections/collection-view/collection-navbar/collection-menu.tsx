import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { FC } from 'react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import deleteCollection from '@/services/api/collections/deleteCollection';
import useSession from '@/services/hooks/auth/use-session';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

interface Props {
    collection: API.Collection;
}

const CollectionMenu: FC<Props> = ({ collection }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const { user: loggedUser } = useSession();

    const deleteCollectionMutation = useMutation({
        mutationFn: deleteCollection,
        onSuccess: () => {
            router.push('/');

            queryClient.invalidateQueries({
                queryKey: ['collections'],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ['collection'],
                exact: false,
            });
        },
    });

    const handleDeleteCollection = async () => {
        try {
            deleteCollectionMutation.mutate({
                params: {
                    reference: collection.reference,
                },
            });
        } catch (e) {
            enqueueSnackbar(
                'Виникла помилка при видаленні повідомлення. Спробуйте, будь ласка, ще раз',
                { variant: 'error' },
            );
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon-md">
                    <MaterialSymbolsMoreHoriz className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                    <Link
                        href={`${CONTENT_TYPE_LINKS['collection']}/${collection.reference}/update`}
                    >
                        <MaterialSymbolsEditRounded className="mr-2" />
                        Редагувати
                    </Link>
                </DropdownMenuItem>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive"
                        >
                            <MaterialSymbolsDeleteForeverRounded className="mr-2" />
                            Видалити
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Ви впевнені, що хочете видалити коментар?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Після цієї операції, Ви вже не зможете його
                                відновити.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Відмінити</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteCollection}>
                                Підтвердити
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CollectionMenu;

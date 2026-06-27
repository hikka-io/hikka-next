import type { FC } from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { CollectionResponse } from '@hikka/api';
import { deleteCollectionMutation } from '@hikka/api';

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
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link, useRouter } from '@/utils/navigation';

type Props = {
    collection: CollectionResponse;
};

const CollectionMenu: FC<Props> = ({ collection }) => {
    const router = useRouter();

    const deleteCollection = useMutation({
        ...deleteCollectionMutation(),
        onSuccess: () => {
            router.push('/');
        },
    });

    const handleDeleteCollection = async () => {
        try {
            deleteCollection.mutate({
                path: { reference: collection.reference },
            });
        } catch (_e) {
            toast.error(
                'Виникла помилка при видаленні колекції. Спробуйте, будь ласка, ще раз',
            );
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-md">
                    <MaterialSymbolsMoreHoriz className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                    <Link
                        to={`${CONTENT_TYPE_LINKS.collection}/${collection.reference}/update`}
                    >
                        <MaterialSymbolsEditRounded className="mr-2" />
                        Редагувати
                    </Link>
                </DropdownMenuItem>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive-foreground"
                        >
                            <MaterialSymbolsDeleteForeverRounded className="mr-2" />
                            Видалити
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Ви впевнені, що хочете видалити колекцію?
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

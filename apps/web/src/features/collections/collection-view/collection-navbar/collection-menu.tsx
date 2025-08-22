import { CollectionContent, CollectionResponse } from '@hikka/client';
import { useDeleteCollection } from '@hikka/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'sonner';

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

interface Props {
    collection: CollectionResponse<CollectionContent>;
}

const CollectionMenu: FC<Props> = ({ collection }) => {
    const router = useRouter();

    const deleteCollectionMutation = useDeleteCollection({
        options: {
            onSuccess: () => {
                router.push('/');
            },
        },
    });

    const handleDeleteCollection = async () => {
        try {
            deleteCollectionMutation.mutate(collection.reference);
        } catch (e) {
            toast.error(
                'Виникла помилка при видаленні повідомлення. Спробуйте, будь ласка, ще раз',
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

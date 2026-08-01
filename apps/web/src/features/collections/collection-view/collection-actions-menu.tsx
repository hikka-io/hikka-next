import type { FC } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteCollectionMutation, getCollectionOptions } from '@hikka/api';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import PageActionsMenu from '@/components/page-actions-menu';
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useSession } from '@/features/auth/hooks/use-session';
import { invalidateCollections } from '@/utils/api/invalidate-content-state';
import { MUTATION_META_SKIP_ERROR_TOAST } from '@/utils/api/mutation-meta';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link, useParams, useRouter } from '@/utils/navigation';

type Props = {
    className?: string;
};

const CollectionActionsMenu: FC<Props> = ({ className }) => {
    const params = useParams();
    const reference = String(params.reference);
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user: loggedUser, isAdmin, isModerator } = useSession();

    const { data: collection } = useQuery(
        getCollectionOptions({ path: { reference } }),
    );

    const deleteCollection = useMutation({
        ...deleteCollectionMutation(),
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        onSuccess: () => {
            invalidateCollections(queryClient);
            router.push('/');
        },
        onError: () => {
            toast.error(
                'Виникла помилка при видаленні колекції. Спробуйте, будь ласка, ще раз',
            );
        },
    });

    const collectionUrl = `${CONTENT_TYPE_LINKS.collection}/${reference}`;
    const canManage =
        !!collection &&
        (loggedUser?.username === collection.author.username ||
            isAdmin() ||
            isModerator());

    return (
        <PageActionsMenu url={collectionUrl} className={className}>
            {canManage && (
                <>
                    <DropdownMenuItem asChild>
                        <Link to={`${collectionUrl}/update`}>
                            <MaterialSymbolsEditRounded />
                            Редагувати
                        </Link>
                    </DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive-foreground"
                            >
                                <MaterialSymbolsDeleteForeverRounded />
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
                                <AlertDialogAction
                                    onClick={() =>
                                        deleteCollection.mutate({
                                            path: { reference },
                                        })
                                    }
                                >
                                    Підтвердити
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}
        </PageActionsMenu>
    );
};

export default CollectionActionsMenu;

import { type FC, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteCollectionMutation } from '@hikka/api';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
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
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useSession } from '@/features/auth/hooks/use-session';
import { invalidateCollections } from '@/utils/api/invalidate-content-state';
import { MUTATION_META_SKIP_ERROR_TOAST } from '@/utils/api/mutation-meta';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link, useParams, useRouter } from '@/utils/navigation';

import CollectionMembersModal from '../collection-members/collection-members-modal';
import { useCollectionAccess } from '../collection-members/use-collection-access';

type Props = {
    className?: string;
};

const CollectionActionsMenu: FC<Props> = ({ className }) => {
    const params = useParams();
    const reference = String(params.reference);
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isModerator } = useSession();

    const { collection, myRole, isOwner } = useCollectionAccess(reference);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [membersOpen, setMembersOpen] = useState(false);

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
    // isModerator() is true for admins as well
    const canEdit = !!collection && (!!myRole || isModerator());
    const canDelete = !!collection && (isOwner || isModerator());

    return (
        <>
            <PageActionsMenu url={collectionUrl} className={className}>
                {canEdit && (
                    <DropdownMenuItem
                        render={<Link to={`${collectionUrl}/update`} />}
                    >
                        <MaterialSymbolsEditRounded />
                        Редагувати
                    </DropdownMenuItem>
                )}
                {myRole && (
                    <DropdownMenuItem onClick={() => setMembersOpen(true)}>
                        <MaterialSymbolsPerson2OutlineRounded />
                        Учасники
                    </DropdownMenuItem>
                )}
                {canDelete && (
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive-foreground"
                    >
                        <MaterialSymbolsDeleteForeverRounded />
                        Видалити
                    </DropdownMenuItem>
                )}
            </PageActionsMenu>
            <ResponsiveModal
                open={membersOpen}
                onOpenChange={setMembersOpen}
                type="sheet"
            >
                <ResponsiveModalContent side="right" title="Учасники">
                    <CollectionMembersModal reference={reference} />
                </ResponsiveModalContent>
            </ResponsiveModal>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
    );
};

export default CollectionActionsMenu;

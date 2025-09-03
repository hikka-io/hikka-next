import { CommentResponse } from '@hikka/client';
import { useDeleteComment, useSession } from '@hikka/react';
import { FC } from 'react';
import { toast } from 'sonner';

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

import { useCommentsContext } from '@/services/providers/comments-provider';

import MaterialSymbolsDeleteForeverRounded from '../icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '../icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsMoreHoriz from '../icons/material-symbols/MaterialSymbolsMoreHoriz';

interface Props {
    comment: CommentResponse;
}

const CommentMenu: FC<Props> = ({ comment }) => {
    const { setState: setCommentsState } = useCommentsContext();

    const { user: loggedUser } = useSession();

    const deleteCommentMutation = useDeleteComment();

    const handleDeleteComment = async () => {
        try {
            deleteCommentMutation.mutate(comment.reference);
        } catch (e) {
            toast.error(
                'Виникла помилка при видаленні повідомлення. Спробуйте, будь ласка, ще раз',
            );
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-sm text-muted-foreground"
                >
                    <MaterialSymbolsMoreHoriz />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {loggedUser?.username === comment.author.username && (
                    <DropdownMenuItem
                        onClick={() =>
                            setCommentsState!((prev) => ({
                                ...prev,
                                currentEdit: comment.reference,
                            }))
                        }
                    >
                        <MaterialSymbolsEditRounded className="mr-2" />
                        Редагувати
                    </DropdownMenuItem>
                )}
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
                                Ви впевнені, що хочете видалити коментар?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Після цієї операції, Ви вже не зможете його
                                відновити.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Відмінити</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteComment}>
                                Підтвердити
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CommentMenu;

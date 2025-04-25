import { CommentResponse } from '@hikka/client';
import { useHideComment, useSession } from '@hikka/react';
import { useSnackbar } from 'notistack';
import { FC } from 'react';

import { useCommentsContext } from '@/services/providers/comments-provider';

import MaterialSymbolsDeleteForeverRounded from '../icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '../icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsMoreHoriz from '../icons/material-symbols/MaterialSymbolsMoreHoriz';
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
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Props {
    comment: CommentResponse;
}

const CommentMenu: FC<Props> = ({ comment }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { setState: setCommentsState } = useCommentsContext();

    const { user: loggedUser } = useSession();

    const deleteCommentMutation = useHideComment();

    const handleDeleteComment = async () => {
        try {
            deleteCommentMutation.mutate(comment.reference);
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
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground text-sm"
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

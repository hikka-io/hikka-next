import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { FC } from 'react';

import deleteComment from '@/services/api/comments/deleteComment';
import useSession from '@/services/hooks/auth/use-session';
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
    comment: API.Comment;
}

const CommentMenu: FC<Props> = ({ comment }) => {
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { setState: setCommentsState } = useCommentsContext();

    const { user: loggedUser } = useSession();

    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['comments'],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ['comment-thread'],
                exact: false,
            });
        },
    });

    const handleDeleteComment = async () => {
        try {
            deleteCommentMutation.mutate({
                params: {
                    reference: comment.reference,
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

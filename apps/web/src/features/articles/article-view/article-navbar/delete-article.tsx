import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { FC } from 'react';

import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
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
import deleteArticle from '@/services/api/articles/deleteArticle';

interface Props {
    article: API.Article;
}

const DeleteArticle: FC<Props> = ({ article }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const deleteArticleMutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            enqueueSnackbar('Статтю успішно видалено.', {
                variant: 'success',
            });
            router.push('/articles');

            queryClient.invalidateQueries({
                queryKey: ['articles'],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ['article'],
                exact: false,
            });
        },
    });

    const handleDeleteArticle = async () => {
        deleteArticleMutation.mutate({
            params: {
                slug: article.slug,
            },
        });
    };

    return (
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
                        Після цієї операції, Ви вже не зможете його відновити.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Відмінити</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteArticle}>
                        Підтвердити
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteArticle;
